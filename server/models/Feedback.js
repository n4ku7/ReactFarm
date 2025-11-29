import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  topic: String,
  rating: Number,
  message: String,
  consent: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
