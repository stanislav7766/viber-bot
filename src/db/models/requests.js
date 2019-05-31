import { Schema } from 'mongoose'

export const RequestModel = new Schema({
  name: { type: String, minlength: 3, maxlength: 22, index: true },
  phoneNumber: { type: Number, minlength: 8, maxlength: 13, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  status: { type: String, enum: ['new', 'active', 'closed', 'rejected'], default: 'new' },
})
