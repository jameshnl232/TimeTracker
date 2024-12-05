import { Request, Response, NextFunction } from 'express'
import ManualTimeModel from '~/models/ManualTime.model.ts'
import { sendManualTimeApprovalEmail } from '~/utils/emailService.ts'

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  const {date, startTime, endTime, pause, comment} = req.body as {
    date: string
    startTime: string
    endTime: string
    pause: number
    comment: string
  }

  const userId = req.userId

  try {
    const request = await ManualTimeModel.create({
      user: userId,
      date,
      startTime,
      endTime,
      pause,
      comment
    })

    return res.status(201).json(request)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Error creating request', err })
  }
}

export const actionRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params
    const { status } = req.body
    const adminId = req.userId

    const request = (await ManualTimeModel.findByIdAndUpdate(
      requestId,
      {
        status,
        approvedBy: adminId,
        approvalDate: new Date()
      },
      { new: true }
    )
      .populate('user', 'email')
      .populate('approvedBy', 'email')) as any

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    const email = request.user.email

    // Send email notification to user
    if (status === 'APPROVED') {
      await sendManualTimeApprovalEmail(email, request)
    } else {
      await sendManualTimeApprovalEmail(email, request)
    }

    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    return res.status(200).json(request)
  } catch (error) {
    return res.status(500).json({ message: 'Error updating request', error })
  }
}

export const getUserRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    const requests = await ManualTimeModel.find({ user: userId })
      .populate('user', 'email')
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 })

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching requests', error })
  }
}

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ManualTimeModel.find()
      .populate('user', 'email')
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 })

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching requests', error })
  }
}
