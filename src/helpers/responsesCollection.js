import { commands } from './markup'
import { papyrus } from './papyrus'
import { context } from './context'
import { contextTree } from './contextTree'
import { validation } from './validation'
import { user } from './keepUserData'
// eslint-disable-next-line
const compose = (...fns) => (...args) => fns.reduce((args, fn) => [fn(...args)], args)

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
    ctx = validation.isEmpty(user.getPhone())
      ? contextTree.getCurrentCtx(commands.FEEDBACK_CONFIRM)
      : ctx
    await response.send(fn(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
}

const CustomQuestionResponse = async (command, response, fn, cq) => {
  const ctx = contextTree.getCurrentCtx(command)
  const f1 = () => response.send(fn(ctx.papyrus, ctx.keyboard))
  const f2 = () => user.setCustomQuestion(cq)

  context.emit('changeContext', ctx)
  !validation.isEmpty(user.getPhone()) &&
    compose(
      f1(),
      f2(),
    )
}
const SuccessFeedbackResponse = async (command, response, fn, phone) => {
  const f1 = () => validation.isEmpty(user.getPhone()) && user.setPhone(phone)
  const f2 = () =>
    context.getContext().command === commands.FEEDBACK_CONFIRM && user.setStatus(true)
  const f3 = () =>
    TextMessageResponse(
      context.getContext().command === commands.ASK_QUESTION ? commands.ASK_QUESTION : command,
      response,
      fn,
    )

  user.getStatus()
    ? response.send(fn(papyrus.getAlreadyExistedFeedback()))
    : compose(
        f1(),
        f2(),
        f3(),
      )
}
const ConfirmFeedbackResponse = async (command, response, fn) => {
  const ctx = contextTree.getCurrentCtx(command)
  context.emit('changeContext', ctx)
  // eslint-disable-next-line
  user.getStatus()
    ? response.send(fn(papyrus.getAlreadyExistedFeedback()))
    : validation.isEmpty(user.getPhone())
    ? TextMessageResponse(command, response, fn)
    : SuccessFeedbackResponse(commands.SUCCESS_FEEDBACK, response, fn, user.getPhone())
}
const InitialResponse = async (command, response, fn, name) => {
  try {
    const ctx = contextTree.getCurrentCtx(command)
    const f1 = () => context.emit('changeContext', ctx)
    const f2 = () => response.send(fn(ctx.papyrus(name), ctx.keyboard))

    !validation.isEmpty(user.getName())
      ? response.send(fn(`Вы уже указали имя ${user.getName()}`))
      : compose(
          f1(),
          f2(),
        )
    !validation.isCorrectName(response.userProfile.name) && user.setName(name)
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
  validation.isCorrectName(userName) && user.setName(userName)
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
