import mongoose from 'mongoose'

const absenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    substitute: {
      type: String
    },
    type: {
      type: String,
      enum: ['Sick', 'Homeoffice', 'Child sick', 'Other'],
      default: 'other'
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    comment: {
      type: String,
      maxLength: 500
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: {
      type: Date
    }
  },
  { timestamps: true }
)

export default mongoose.model('AbsenceRequest', absenceSchema)
