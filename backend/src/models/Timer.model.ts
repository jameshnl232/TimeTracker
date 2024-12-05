import mongoose from 'mongoose'

const timeRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workingTime: {
      type: Number,
      default: 0
    },
    breakTime: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model('TimeRecord', timeRecordSchema)
