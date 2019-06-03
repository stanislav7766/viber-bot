import * as winston from 'winston'
import WinstonTelegram from 'winston-telegram'
import moment from 'moment'
import dotenv from 'dotenv'
import { papyrus } from './papyrus'

require('winston-mail')

dotenv.config()
const { combine, label, printf, colorize, timestamp } = winston.format
const logLabel = papyrus.getApiLabel()
const logTimestamp = moment().format('MM-DD-YY H:mm:ss')
const logMessageFormat = printf(info => `[${info.label}]: ${info.message} | ${info.timestamp}`)
const levels = {
  ...winston.config.syslog.levels,
  mail: 8,
  telegram_technical: 9,
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
        label({ label: logLabel }),
        colorize({ all: true }),
        timestamp({ format: logTimestamp }),
        logMessageFormat,
      ),
    }),
    new WinstonTelegram({
      level: 'telegram_technical',
      template: `[${logLabel}][telegram_technical]: {message} | ${logTimestamp}`,
      token: process.env.INFO_BOT_TOKEN,
      chatId: process.env.INFO_BOT_CHAT_ID,
      unique: true,
    }),
  ],
})

export const definiteLoggerLevel = message =>
  logger.log(process.env.NODE_ENV === 'production' ? 'telegram_technical' : 'info', message)
