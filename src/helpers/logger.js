import * as winston from 'winston'
import WinstonTelegram from 'winston-telegram'
import moment from 'moment'
import dotenv from 'dotenv'
import { papyrus } from './papyrus'

dotenv.config()
const { combine, label, printf, colorize, timestamp } = winston.format
const logLabel = papyrus.getAppLabel()
const logTimestamp = moment().format('MM-DD-YY H:mm:ss')
const logMessageFormat = printf(info => `[${info.label}]: ${info.message} | ${info.timestamp}`)
const levels = {
  ...winston.config.syslog.levels,
  mail: 8,
  telegram_technical: 9,
  telegram_sales: 10,
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
      template: `[${logLabel}]: {message} | ${logTimestamp}`,
      token: process.env.INFO_BOT_TOKEN,
      chatId: process.env.CHAT_ID_TECHNICAL,
      unique: true,
    }),
    new WinstonTelegram({
      level: 'telegram_sales',
      template: `[${logLabel}]: {message} | ${logTimestamp}`,
      token: process.env.INFO_BOT_TOKEN,
      chatId: process.env.CHAT_ID_SALES,
      unique: true,
    }),
  ],
})

export const definiteLoggerLevel = (message, level) =>
  logger.log(process.env.NODE_ENV === 'production' ? level : 'info', message)
