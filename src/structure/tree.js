import { commands, KeyboardGenerator, markup, papyrus } from '../helpers/index'

function Tree() {
  this.nodes = []
}
function Node(data, parent) {
  this.data = data
  this.children = []
  this.parent = parent
  parent && parent.children.push(this)
}
Tree.prototype.insert = function(data, parentName) {
  let foundParent = {}
  if (parentName) {
    foundParent = this.nodes.find(node => (node.data.command === parentName ? node : null))
    this.nodes.push(
      new Node(data, foundParent !== undefined && this.nodes.length !== 0 ? foundParent : null),
    )
  } else this.nodes.push(new Node(data, null))
}
Tree.prototype.searchContext = function(command) {
  return this.nodes.find(node => (node.data.command === command ? node : null))
}
Tree.prototype.getCurrentCtx = function(command) {
  const node = this.searchContext(command)
  return node ? node.data : null
}

const tree = new Tree()
tree.insert({
  command: commands.INITIAL,
  keyboard: KeyboardGenerator(markup.initialKeyboard()),
  papyrus: name => papyrus.getInitialGreeting(name),
})
tree.insert(
  {
    command: commands.START,
    keyboard: KeyboardGenerator(markup.chooseAfterStart()),
    papyrus: papyrus.getQuestionAfterStart(),
  },
  commands.INITIAL,
)
tree.insert(
  {
    command: commands.FEEDBACK_CONFIRM,
    keyboard: '',
    papyrus: papyrus.getAskPhone(),
  },
  commands.START,
)
tree.insert(
  {
    command: commands.ASK_NAME,
    keyboard: '',
    papyrus: papyrus.getAskName(),
  },
  commands.INITIAL,
)
tree.insert(
  {
    command: commands.SUCCESS_FEEDBACK,
    keyboard: '',
    papyrus: papyrus.getSuccessFeedback(),
  },
  commands.START,
)
tree.insert(
  {
    command: commands.CONSULTATION,
    keyboard: KeyboardGenerator(markup.chooseQuestion()),
    papyrus: papyrus.getSections(),
  },
  commands.START,
)
tree.insert(
  {
    command: commands.CAPABILITIES,
    keyboard: KeyboardGenerator(markup.goBack()),
    papyrus: papyrus.getCapabilities(),
  },
  commands.CONSULTATION,
)
tree.insert(
  {
    command: commands.CONTACTS,
    keyboard: KeyboardGenerator(markup.confirmFeedback()),
    papyrus: papyrus.getContacts(),
  },
  commands.CONSULTATION,
)
tree.insert(
  {
    command: commands.PRICES_AND_DEADLINES,
    keyboard: KeyboardGenerator(markup.goBack()),
    papyrus: papyrus.getPricesAndDeadlines(),
  },
  commands.CONSULTATION,
)
tree.insert(
  {
    command: commands.ASK_QUESTION,
    keyboard: '',
    papyrus: papyrus.getAskQuestion(),
  },
  commands.CONSULTATION,
)
export { tree }
