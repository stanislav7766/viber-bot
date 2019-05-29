import * as winston from 'winston'
import WinstonTelegram from 'winston-telegram'
import moment from 'moment'
import dotenv from 'dotenv'

require('winston-mail')

dotenv.config()
const {combine, label, printf, colorize, timestamp} = winston.format
const logLabel = `Bots Bussiness Api`
const logTimestamp = moment().format('MM-DD-YY H:mm:ss')
const logMessageFormat = printf(info => `[${info.label}]: ${info.message} | ${info.timestamp}`)
const levels = {
  ...winston.config.syslog.levels,
  mail: 8,
  telegram_emergency: 9,
  telegram_info: 10,
}

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  verbose: 'blue',
  debug: 'white',
  silly: 'white',
})

export const logger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamps: true,
      format: combine(
        label({label: logLabel}),
        colorize({all: true}),
        timestamp({format: logTimestamp}),
        logMessageFormat,
      ),
    }),
    new winston.transports.Mail({
      level: 'mail',
      tls: true,
      unique: true,
      to: process.env.LOGGER_MAIL_RECIPIENT,
      from: process.env.LOGGER_MAIL_RECIPIENT,
      host: process.env.LOGGER_MAIL_HOST,
      port: process.env.LOGGER_MAIL_PORT,
      subject: 'Something wrongs with Bots Bussiness',
      username: process.env.LOGGER_MAIL_RECIPIENT,
      password: process.env.LOGGER_MAIL_PASSWORD,
      html: true,
    }),
    new WinstonTelegram({
      level: 'telegram_emergency',
      token: process.env.INFO_BOT_TOKEN,
      chatId: process.env.INFO_BOT_CHAT_ID,
      unique: true,
      // template: papyrus.tips.botMother.alertTemplate,
      template: '123',
    }),
    new WinstonTelegram({
      level: 'telegram_info',
      token: process.env.INFO_BOT_TOKEN,
      chatId: process.env.INFO_BOT_CHAT_ID,
      unique: true,
      template: '123',
      // template: papyrus.tips.botMother.notificationTemplate
    }),
  ],
})
