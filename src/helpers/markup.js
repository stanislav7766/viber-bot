export const commands = {
  START: '/start',
  CONSULTATION: '/consultation',
  FEEDBACK_CONFIRM: '/feedback_confirm',
  FEEDBACK_NOT_CONFIRM: '/feedback_not_confirm',
  CAPABILITIES: '/capabilities',
  PRICES_AND_DEADLINES: '/prices_and_deadlines',
  CONTACTS: '/contacts',
  GO_BACK: '/go_back',
  ASK_QUESTION: '/ask_question',
}

export const markup = {
  initialKeyboard: () => {
    const keyboard = [
      {
        text: '/start',
        actionBody: commands.START,
        cols: 6,
      },
    ]
    return keyboard
  },
  chooseAfterStart: () => {
    const keyboards = [
      {
        text: 'Оставить заявку',
        actionBody: commands.FEEDBACK_CONFIRM,
        cols: 3,
      },
      {
        text: 'Получить консультацию',
        actionBody: commands.CONSULTATION,
        cols: 3,
      },
    ]
    return keyboards
  },
  chooseQuestion: () => {
    const keyboards = [
      {
        text: 'Возможности',
        actionBody: commands.CAPABILITIES,
        cols: 3,
      },
      {
        text: 'Цены/Сроки',
        actionBody: commands.PRICES_AND_DEADLINES,
        cols: 3,
      },
      {
        text: 'Контакты',
        actionBody: commands.CONTACTS,
        cols: 3,
      },
      {
        text: 'Задать вопрос',
        actionBody: commands.ASK_QUESTION,
        cols: 3,
      },
    ]
    return keyboards
  },
  confirmFeedback: () => {
    const keyboards = [
      {
        text: 'Да, оставить заявку',
        actionBody: commands.FEEDBACK_CONFIRM,
        cols: 3,
      },
      {
        text: 'Нет, спасибо',
        actionBody: commands.FEEDBACK_NOT_CONFIRM,
        cols: 3,
      },
    ]
    return keyboards
  },
  goBack: () => {
    const keyboard = [
      {
        text: 'Вернуться назад',
        actionBody: commands.GO_BACK,
        cols: 6,
      },
    ]
    return keyboard
  },
}
