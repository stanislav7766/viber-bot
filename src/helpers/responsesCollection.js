import dotenv from 'dotenv'
import axios from 'axios'
import { commands } from './markup'
import { papyrus } from './papyrus'
import { context } from './context'
import { contextTree } from './contextTree'
import { validation } from './validation'

dotenv.config()
const opt = {
  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
}
const errorOnResponse = res => res === 502 || res === 404

const saveRequest = async () => {
  try {
    const user = {
      name: context.getName(),
      phoneNumber: context.getPhone(),
      status: 'new',
    }
    const requestResult = await axios.post(process.env.HOST_API_REQUEST, user, opt)
    return requestResult.data
  } catch (err) {
    console.log(err.response)
    return err.response.status
  }
}
const saveQuestion = async () => {
  try {
    const user = {
      name: context.getName(),
      phoneNumber: context.getPhone(),
      question: context.getCustomQuestion(),
      status: 'new',
    }
    const questionResult = await axios.post(process.env.HOST_API_QUESTION, user, opt)
    return questionResult.data
  } catch (err) {
    console.log(err.response)
    return err.response.status
  }
}

const TextMessageResponse = async (command, response, fn) => {
  try {
    const ctx = contextTree.getCurrentCtx(command)
    context.emit('changeContext', ctx)
    await response.send(fn(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
}
const AskQuestionResponse = async (command, response, fn) => {
  try {
    let ctx = contextTree.getCurrentCtx(command)
    context.emit('changeContext', ctx)
    ctx = validation.isEmpty(context.getPhone())
      ? contextTree.getCurrentCtx(commands.FEEDBACK_CONFIRM)
      : ctx
    await response.send(fn(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
}

const CustomQuestionResponse = async (command, response, fn, cq) => {
  const ctx = contextTree.getCurrentCtx(command)
  context.setCustomQuestion(cq)

  const f1 = () => saveQuestion()
  const f2 = async res => {
    if (errorOnResponse(await res)) response.send(fn(papyrus.errorOnSaveQuestion()))
    else {
      const questionResult = await res
      questionResult.status === 'ok'
        ? response.send(fn(ctx.papyrus, ctx.keyboard))
        : response.send(fn(questionResult.msg))
    }
  }

  context.emit('changeContext', ctx)
  !validation.isEmpty(context.getPhone()) && f2(f1())
}

const SuccessFeedbackResponse = async (command, response, fn, phone) => {
  validation.isEmpty(context.getPhone()) && context.setPhone(phone)

  const f1 = () => saveRequest()
  const f2 = async res => {
    if (errorOnResponse(await res)) response.send(fn(papyrus.errorOnSaveRequest()))
    else {
      const requestResult = await res
      requestResult.status === 'ok'
        ? TextMessageResponse(
            context.getContext().command === commands.ASK_QUESTION
              ? commands.ASK_QUESTION
              : command,
            response,
            fn,
          )
        : response.send(fn(requestResult.msg))
    }
  }
  const feedback = () => f2(f1())
  const question = () => TextMessageResponse(commands.ASK_QUESTION, response, fn)
  const another = () => response.send(fn(papyrus.getErrorAnotherCtx()))

  if (context.getContext().command === commands.FEEDBACK_CONFIRM) feedback()
  else if (context.getContext().command === commands.ASK_QUESTION) question()
  else another()
}
const ConfirmFeedbackResponse = async (command, response, fn) => {
  const ctx = contextTree.getCurrentCtx(command)
  context.emit('changeContext', ctx)
  validation.isEmpty(context.getPhone())
    ? TextMessageResponse(command, response, fn)
    : SuccessFeedbackResponse(commands.SUCCESS_FEEDBACK, response, fn, context.getPhone())
}
const InitialResponse = async (command, response, fn, name) => {
  try {
    const ctx = contextTree.getCurrentCtx(command)
    const f1 = () => context.emit('changeContext', ctx)
    const f2 = () => response.send(fn(ctx.papyrus(name), ctx.keyboard))

    validation.isEmpty(context.getName())
      ? f2(f1())
      : response.send(fn(`Вы уже указали имя ${context.getName()}`))

    !validation.isCorrectName(response.userProfile.name) && context.setName(name)
  } catch (err) {
    console.log(err)
  }
}
const BackResponse = async (response, fn) => {
  try {
    const ctx = contextTree.getCurrentCtx(commands.CONSULTATION)
    await response.send(fn(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
}

const ConversationStarted = async (onFinish, fn, userName) => {
  validation.isCorrectName(userName) && context.setName(userName)

  const ctx = contextTree.getCurrentCtx(
    validation.isCorrectName(userName) ? commands.INITIAL : commands.ASK_NAME,
  )
  context.emit('changeContext', ctx)
  onFinish(
    validation.isCorrectName(userName) ? fn(ctx.papyrus(userName), ctx.keyboard) : fn(ctx.papyrus),
  )
}
const responsesCollection = new Map()

responsesCollection.set(commands.START, (response, fn) =>
  TextMessageResponse(commands.START, response, fn),
)
responsesCollection.set(commands.INITIAL, async (response, fn, name) =>
  InitialResponse(commands.INITIAL, response, fn, name),
)
responsesCollection.set(commands.FEEDBACK_CONFIRM, (response, fn) =>
  ConfirmFeedbackResponse(commands.FEEDBACK_CONFIRM, response, fn),
)
responsesCollection.set(commands.SUCCESS_FEEDBACK, (response, fn, phone) =>
  SuccessFeedbackResponse(commands.SUCCESS_FEEDBACK, response, fn, phone),
)
responsesCollection.set(commands.CONSULTATION, (response, fn) =>
  TextMessageResponse(commands.CONSULTATION, response, fn),
)
responsesCollection.set(commands.CAPABILITIES, (response, fn) =>
  TextMessageResponse(commands.CAPABILITIES, response, fn),
)
responsesCollection.set(commands.PRICES_AND_DEADLINES, (response, fn) =>
  TextMessageResponse(commands.PRICES_AND_DEADLINES, response, fn),
)
responsesCollection.set(commands.CONTACTS, (response, fn) =>
  TextMessageResponse(commands.CONTACTS, response, fn),
)
responsesCollection.set(commands.ASK_QUESTION, (response, fn) =>
  AskQuestionResponse(commands.ASK_QUESTION, response, fn),
)
responsesCollection.set(commands.CUSTOM_QUESTION, (response, fn, cq) =>
  CustomQuestionResponse(commands.CUSTOM_QUESTION, response, fn, cq),
)
responsesCollection.set(commands.GO_BACK, async (response, fn) => BackResponse(response, fn))
responsesCollection.set(commands.CONVERSATION_STARTED, async (onFinish, fn, name) =>
  ConversationStarted(onFinish, fn, name),
)

export { responsesCollection }
