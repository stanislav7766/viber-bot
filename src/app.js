import { Bot as ViberBot, Message, Events } from 'viber-bot'
import express from 'express'
import dotenv from 'dotenv'
import {
  commands,
  logger,
  definiteLoggerLevel,
  responsesCollection,
  context,
  validation,
} from './helpers/index'

dotenv.config()
const app = express()
const BotEvents = Events

const TextMessage = Message.Text
const PORT = process.env.API_PORT

const bot = new ViberBot({
  logger,
  authToken: process.env.BOT_ACCOUNT_TOKEN,
  name: 'Bots business',
  avatar: null,
})

const cbTextMessage = (...args) => new TextMessage(...args)

bot.onConversationStarted(
  (contextProfile, isSubscribed, contextBot, onFinish) =>
    responsesCollection.has(commands.CONVERSATION_STARTED) &&
    responsesCollection.get(commands.CONVERSATION_STARTED)(
      onFinish,
      cbTextMessage,
      contextProfile.name,
    ),
)
bot.onUnsubscribe(userId => {
  context.clearContext()
  definiteLoggerLevel(`Unsubscribed: ${userId}, ctx cleared`)
})
bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
  if (responsesCollection.has(message.text))
    responsesCollection.get(message.text)(response, cbTextMessage)
  else if (validation.isCorrectPhone(message.text))
    responsesCollection.has(commands.SUCCESS_FEEDBACK) &&
      responsesCollection.get(commands.SUCCESS_FEEDBACK)(response, cbTextMessage, message.text)
  else if (validation.isName(message.text, context.getContext()))
    responsesCollection.has(commands.INITIAL) &&
      responsesCollection.get(commands.INITIAL)(response, cbTextMessage, message.text)
  else if (validation.isCustomQuestion(message.text, context.getContext(), context.getPhone()))
    responsesCollection.has(commands.CUSTOM_QUESTION) &&
      responsesCollection.get(commands.CUSTOM_QUESTION)(response, cbTextMessage, message.text)
  else response.send(new TextMessage('Укажите пожалуйста валиднные данные'))
})

bot.onError(err => definiteLoggerLevel(`Something wrong with bot, error: ${err}`))

app.use('/viber/webhook', bot.middleware())

app.listen(PORT, () => {
  console.log(`Application running on PORT: ${PORT}`)
  bot.setWebhook(`${process.env.EXPOSE_URL}/viber/webhook`).catch(err => {
    definiteLoggerLevel(`Something wrong with bot, error: ${err}`)
    process.exit(1)
  })
})
