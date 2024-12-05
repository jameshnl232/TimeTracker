import mongoose from 'mongoose'

const manualTimeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true,
  
    },
    endTime: {
      type: String,
      required: true,

    },
    pause: {
      type: Number,
      default: 0
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

export default mongoose.model('ManualTime', manualTimeSchema)
