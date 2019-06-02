import { commands } from './markup'

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'function' && value.length === 0) ||
  (Array.isArray(value) && value.length === 0) ||
  (value instanceof Error && value.message === '')

const isCorrectName = name => /^([а-яієїА-ЯІЄЇa-zA-Z]){3,}$/i.test(name)
const isCorrectPhone = phone => /^([0-9]){12,12}$/g.test(phone)
const isName = (name, ctx) => isCorrectName(name) && (ctx && ctx.command === commands.ASK_NAME)
const isCustomQuestion = (q, ctx, phone) =>
  /^[.,?!;:'"*/)(+-а-яієїА-ЯІЄЇa-zA-Z\w\s]{7,}$/i.test(q) &&
  ctx.command === commands.ASK_QUESTION &&
  !isEmpty(phone)

export const validation = { isCorrectName, isCorrectPhone, isName, isEmpty, isCustomQuestion }
