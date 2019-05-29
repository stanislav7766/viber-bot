'use strict'

import { Bot as ViberBot, Message } from 'viber-bot'
import express from 'express'
import dotenv from 'dotenv'
import { commands, KeyboardGenerator, logger, markup, papyrus, context } from './helpers/index'

const app = express()
dotenv.config()
const TextMessage = Message.Text
const PORT = process.env.API_PORT

const bot = new ViberBot({
  logger: logger,
  authToken: process.env.BOT_ACCOUNT_TOKEN,
  name: 'Bot Mother',
  avatar: null,
})

const ctx = context()
ctx.on('changeContext', data => ctx.setContext(data))

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
  onFinish(
    new TextMessage(
      papyrus.getInitialGreeting(userProfile.name),
      KeyboardGenerator(markup.initialKeyboard())
    )
  )
})

bot.onTextMessage(new RegExp(`^${commands.START}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.START)
    await response.send(
      new TextMessage(papyrus.getQuestionAfterStart(), KeyboardGenerator(markup.chooseAfterStart()))
    )
  } catch (err) {
    console.log(err)
  }
})

bot.onTextMessage(
  new RegExp(`^${commands.FEEDBACK_NOT_CONFIRM}$`, 'g'),
  async (message, response) => {
    try {
      ctx.emit('changeContext', commands.FEEDBACK_NOT_CONFIRM)
      await response.send(new TextMessage(papyrus.getFeddbackNotConfirm()))
    } catch (err) {
      console.log(err)
    }
  }
)

bot.onTextMessage(new RegExp(`^${commands.FEEDBACK_CONFIRM}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.FEEDBACK_CONFIRM)
    await response.send(new TextMessage(papyrus.getFeedbackConfirm()))
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.CONSULTATION}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.CONSULTATION)
    await response.send(
      new TextMessage(papyrus.getSections(), KeyboardGenerator(markup.chooseQuestion()))
    )
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.CAPABILITIES}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.CAPABILITIES)
    await response.send(
      new TextMessage(papyrus.getCapabilities(), KeyboardGenerator(markup.goBack()))
    )
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(
  new RegExp(`^${commands.PRICES_AND_DEADLINES}$`, 'g'),
  async (message, response) => {
    try {
      ctx.emit('changeContext', commands.PRICES_AND_DEADLINES)
      await response.send(
        new TextMessage(papyrus.getPricesAndDeadlines(), KeyboardGenerator(markup.goBack()))
      )
    } catch (err) {
      console.log(err)
    }
  }
)
bot.onTextMessage(new RegExp(`^${commands.CONTACTS}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.CONTACTS)
    await response.send(
      new TextMessage(papyrus.getContacts(), KeyboardGenerator(markup.confirmFeedback()))
    )
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.GO_BACK}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.GO_BACK)
    await response.send(
      new TextMessage(papyrus.getQuestionAfterStart(), KeyboardGenerator(markup.chooseQuestion()))
    )
  } catch (err) {
    console.log(err)
  }
})
bot.onTextMessage(new RegExp(`^${commands.ASK_QUESTION}$`, 'g'), async (message, response) => {
  try {
    ctx.emit('changeContext', commands.ASK_QUESTION)
    await response.send(new TextMessage(papyrus.getAskQuestion()))
  } catch (err) {
    console.log(err)
  }
})

bot.onError(err => console.error(err))

app.use('/viber/webhook', bot.middleware())

app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`)
  bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`).catch(error => {
    console.log('Can not set webhook on following server. Is it running?')
    console.error(error)
    process.exit(1)
  })
})
