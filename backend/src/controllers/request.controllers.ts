import { Request, Response, NextFunction } from 'express'
import RequestModel from '~/models/Request.model.ts'
import { sendApprovalEmail } from '~/utils/emailService.ts'

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { fromDate, toDate, comment } = req.body

  const userId = req.userId

  try {
    const request = await RequestModel.create({
      user: userId,
      fromDate,
      toDate,
      comment
    })

    return res.status(201).json(request)
  } catch (err) {
    return res.status(500).json({ message: 'Error creating request', err })
  }
}

export const actionRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params
    const { status } = req.body
    const adminId = req.userId

    const request = (await RequestModel.findByIdAndUpdate(
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
      await sendApprovalEmail(email, request)
    } else {
      await sendApprovalEmail(email, request)
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

    const requests = await RequestModel.find({ user: userId })
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
    const requests = await RequestModel.find()
      .populate('user', 'email')
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 })

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching requests', error })
  }
}
