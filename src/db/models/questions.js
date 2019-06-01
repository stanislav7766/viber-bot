import { Schema } from 'mongoose'

export const QuestionModel = new Schema({
  name: { type: String, minlength: 3, maxlength: 22, index: true },
  // phoneNumber: { type: Number, minlength: 8, maxlength: 13, index: true },
  phoneNumber: { type: Number, min: 12, max: 12, required: true },
  question: { type: String, enum: ['new', 'active', 'closed', 'rejected'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  status: { type: String, enum: ['new', 'processed'], default: 'new' },
})
