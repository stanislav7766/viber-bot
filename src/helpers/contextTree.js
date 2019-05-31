import { commands, KeyboardGenerator, markup, papyrus, ctxTree } from '../helpers/index' //eslint-disable-line

ctxTree.insert({
  command: commands.INITIAL,
  keyboard: KeyboardGenerator(markup.initialKeyboard()),
  papyrus: name => papyrus.getInitialGreeting(name),
})
ctxTree.insert(
  {
    command: commands.START,
    keyboard: KeyboardGenerator(markup.chooseAfterStart()),
    papyrus: papyrus.getQuestionAfterStart(),
  },
  commands.INITIAL,
)
ctxTree.insert(
  {
    command: commands.FEEDBACK_CONFIRM,
    keyboard: '',
    papyrus: papyrus.getAskPhone(),
  },
  commands.START,
)
ctxTree.insert(
  {
    command: commands.ASK_NAME,
    keyboard: '',
    papyrus: papyrus.getAskName(),
  },
  commands.INITIAL,
)
ctxTree.insert(
  {
    command: commands.SUCCESS_FEEDBACK,
    keyboard: '',
    papyrus: papyrus.getSuccessFeedback(),
  },
  commands.START,
)
ctxTree.insert(
  {
    command: commands.CONSULTATION,
    keyboard: KeyboardGenerator(markup.chooseQuestion()),
    papyrus: papyrus.getSections(),
  },
  commands.START,
)
ctxTree.insert(
  {
    command: commands.CAPABILITIES,
    keyboard: KeyboardGenerator(markup.goBack()),
    papyrus: papyrus.getCapabilities(),
  },
  commands.CONSULTATION,
)
ctxTree.insert(
  {
    command: commands.CONTACTS,
    keyboard: KeyboardGenerator(markup.confirmFeedback()),
    papyrus: papyrus.getContacts(),
  },
  commands.CONSULTATION,
)
ctxTree.insert(
  {
    command: commands.PRICES_AND_DEADLINES,
    keyboard: KeyboardGenerator(markup.goBack()),
    papyrus: papyrus.getPricesAndDeadlines(),
  },
  commands.CONSULTATION,
)
ctxTree.insert(
  {
    command: commands.ASK_QUESTION,
    keyboard: '',
    papyrus: papyrus.getAskQuestion(),
  },
  commands.CONSULTATION,
)

export const contextTree = ctxTree
