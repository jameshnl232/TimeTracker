import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import User from '~/models/User.model.ts'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { errorHandler } from '~/utils/error.ts'
import { sendLoginNotification } from '~/utils/emailService.ts'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = errorHandler(422, errors.array()[0].msg)
    return next(error)
  }

  const user = await User.findOne({ email })

  if (!user) {
    return next(errorHandler(404, 'Invalid email or password!'))
  }

  try {
    const isMatch = await bcrypt.compare(password.toString(), user.password.toString())
    if (!isMatch) {
      return next(errorHandler(404, 'Invalid password!'))
    }
    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '3h',
      algorithm: 'HS256'
    })

    // Send login notification email
    await sendLoginNotification(user.email)

    res.status(200).json({ user, token, userId: user._id, message: 'Login successful!' })
  } catch (err) {
    const error = errorHandler(500, 'Login failed!')
    console.log(err)
    return next(error)
    
  }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email: string; password: string }

  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = errorHandler(422, errors.array()[0].msg)
    return next(error)
  }

  const hashedPassword = bcrypt.hashSync(password.toString(), 12)

  const newUser = new User({ email, password: hashedPassword })

  try {
    await newUser.save()
    res.status(201).json({ message: 'Sign up successfully!' })
  } catch (err) {
    console.log(err)
    const error = errorHandler(500, 'Sign up failed!')
    return next(error)
  }
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body as { email: string }

  const user = await User.findOne({ email })
  if (user) {
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '3h',
      algorithm: 'HS256'
    })

    await sendLoginNotification(user.email)

    res.status(200).json({ user, userId: user.id, token, message: 'Login successful!' })
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    const hashedPassword = bcrypt.hashSync(generatedPassword, 12)
    const newUser = new User({ email, password: hashedPassword })

    try {
      await newUser.save()
      const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET as string, {
        expiresIn: '3h',
        algorithm: 'HS256'
      })

      await sendLoginNotification(newUser.email)

      res.status(201).json({ user: newUser, userId: newUser.id, token, message: 'Login successful!' })
    } catch (err: any) {
      if (err.code === 11000) {
        return next(errorHandler(409, 'User with this Google ID already exists!'))
      }
      const error = errorHandler(500, 'Sign up failed!')
      return next(error)
    }
  }
}

export const logout = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }

  await sendLoginNotification(email, true)

  res.json({ message: 'Logout route works!' })
}
