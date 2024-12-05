import { Request, Response, NextFunction } from 'express'
import { sendAbsenceApprovalEmail, sendApprovalEmail } from '~/utils/emailService.ts'
import AbsenceRequestModel from '~/models/Absence.model.ts'

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { fromDate, toDate, comment, substitute, type } = req.body

  const userId = req.userId

  try {
    const request = await AbsenceRequestModel.create({
      user: userId,
      fromDate,
      toDate,
      comment,
      substitute,
      type
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

    const request = (await AbsenceRequestModel.findByIdAndUpdate(
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
      await sendAbsenceApprovalEmail(email, request)
    } else {
      await sendAbsenceApprovalEmail(email, request)
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

    const requests = await AbsenceRequestModel.find({ user: userId })
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
    const requests = await AbsenceRequestModel.find()
      .populate('user', 'email')
      .populate('approvedBy', 'email')
      .sort({ createdAt: -1 })

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching requests', error })
  }
}
