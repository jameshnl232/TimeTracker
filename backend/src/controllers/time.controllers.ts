import { Request, Response, NextFunction } from 'express'
import Timer from '~/models/Timer.model.ts'

export const getTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timer = await Timer.findOne({ userId: req.userId })

    if (!timer) {
      return res.status(404).json({ message: 'Timer not found' })
    }

    return res.status(200).json(timer)
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching timer', err })
  }
}

export const updateTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workingTime, breakTime } = req.body

    const timer = await Timer.findOne({ userId: req.userId })

    if (!timer) {
      const newTimer = new Timer({ userId: req.userId, workingTime, breakTime })
      await newTimer.save()
      return res.status(201).json(newTimer)
    }

    // Update existing timer
    timer.workingTime = workingTime
    timer.breakTime = breakTime

    // Save updated timer
    const updatedTimer = await timer.save()

    return res.status(200).json(updatedTimer)
  } catch (err) {
    return res.status(500).json({ message: 'Error updating timer', err })
  }
}
