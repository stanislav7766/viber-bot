export const commands = {
  START: '/start',
  CONSULTATION: '/consultation',
  FEEDBACK_CONFIRM: '/feedback_confirm',
  CAPABILITIES: '/capabilities',
  PRICES_AND_DEADLINES: '/prices_and_deadlines',
  CONTACTS: '/contacts',
  GO_BACK: '/go_back',
  ASK_QUESTION: '/ask_question',
  CUSTOM_QUESTION: '/custom_question',
  ASK_NAME: '/ask_name',
  INITIAL: '/initial',
  CONVERSATION_STARTED: '/conversation_started',
  SUCCESS_FEEDBACK: '/success_feedback',
}

export const markup = {
  initialKeyboard: () => [
    {
      text: '/start',
      actionBody: commands.START,
      cols: 6,
    },
  ],
  chooseAfterStart: () => [
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
  ],
  chooseQuestion: () => [
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
  ],
  confirmFeedback: () => [
    {
      text: 'Да, оставить заявку',
      actionBody: commands.FEEDBACK_CONFIRM,
      cols: 3,
    },
    {
      text: 'Вернуться назад',
      actionBody: commands.GO_BACK,
      cols: 3,
    },
  ],
  goBack: () => [
    {
      text: 'Вернуться назад',
      actionBody: commands.GO_BACK,
      cols: 6,
    },
  ],
}
