import { Bot as ViberBot, Message } from 'viber-bot'
import express from 'express'
import dotenv from 'dotenv'
import { commands, logger, context, user, isCorrectName } from './helpers/index'
import { tree } from './structure/index'

dotenv.config()
const app = express()
const TextMessage = Message.Text
const PORT = process.env.API_PORT

const bot = new ViberBot({
  logger,
  authToken: process.env.BOT_ACCOUNT_TOKEN,
  name: 'Bot Mother',
  avatar: null,
})

bot.onConversationStarted((userProfile, isSubscribed, context1, onFinish) => {
  isCorrectName(userProfile.name) && user.setName(userProfile.name)
  const ctx = tree.getCurrentCtx(
    isCorrectName(userProfile.name) ? commands.INITIAL : commands.ASK_NAME,
  )
  context.emit('changeContext', ctx)
  onFinish(
    isCorrectName(userProfile.name)
      ? new TextMessage(ctx.papyrus(userProfile.name), ctx.keyboard)
      : new TextMessage(ctx.papyrus),
  )
})

bot.onTextMessage(new RegExp(`^${commands.START}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.START)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
})

bot.onTextMessage(new RegExp(`^([0-9]){12,12}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.SUCCESS_FEEDBACK)
    context.emit('changeContext', ctx)
    user.setPhone(message.text)
    await response.send(new TextMessage(ctx.papyrus))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^([а-яієїА-ЯІЄЇa-zA-Z]){3,}$`, 'i'), async (message, response) => {
  try {
    if (!isCorrectName(response.userProfile.name)) {
      const ctx = tree.getCurrentCtx(commands.INITIAL)
      context.emit('changeContext', ctx)
      user.setName(message.text)
      await response.send(new TextMessage(ctx.papyrus(message.text), ctx.keyboard))
    }
  } catch (err) {
    console.log(err)
  }
})

bot.onTextMessage(new RegExp(`^${commands.FEEDBACK_CONFIRM}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.FEEDBACK_CONFIRM)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.CONSULTATION}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.CONSULTATION)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.CAPABILITIES}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.CAPABILITIES)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(
  new RegExp(`^${commands.PRICES_AND_DEADLINES}$`, 'g'),
  async (message, response) => {
    try {
      const ctx = tree.getCurrentCtx(commands.PRICES_AND_DEADLINES)
      context.emit('changeContext', ctx)
      await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
    } catch (err) {
      console.log(err)
    }
  },
)
bot.onTextMessage(new RegExp(`^${commands.CONTACTS}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.CONTACTS)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
})

bot.onTextMessage(new RegExp(`^${commands.GO_BACK}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.CONSULTATION)
    await response.send(new TextMessage(ctx.papyrus, ctx.keyboard))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.ASK_QUESTION}$`, 'g'), async (message, response) => {
  try {
    const ctx = tree.getCurrentCtx(commands.ASK_QUESTION)
    context.emit('changeContext', ctx)
    await response.send(new TextMessage(ctx.papyrus))
  } catch (err) {
    console.log(err)
  }
})

bot.onError(err => console.log('error', err))

app.use('/viber/webhook', bot.middleware())

app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`)
  bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`).catch(err => {
    console.log(`Can not set webhook on following server. Is it running?`)
    console.log(err)
    process.exit(1)
  })
})
