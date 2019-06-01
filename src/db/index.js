import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { RequestModel } from './models/requests'
import { QuestionModel } from './models/questions'

dotenv.config()
mongoose.Promise = Promise
mongoose.connection.on('connected', () => console.log('Connection Established'))
mongoose.connection.on('reconnected', () => console.log('Connection Reestablished'))
mongoose.connection.on('disconnected', () => console.log('Connection Disconnected'))
mongoose.connection.on('close', () => console.log('Connection Closed'))
mongoose.connection.on('error', err => console.log(err))

const db = process.env.MLAB_URI
const opt = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }

const connect = async () => {
  await mongoose.connect(db, opt)
}

connect().catch(error => console.error(error))
const Request = mongoose.models.requests || mongoose.model('requests', RequestModel)
const Question = mongoose.model('questions', QuestionModel)

// Models registration️ ®️
export { Request, Question }
