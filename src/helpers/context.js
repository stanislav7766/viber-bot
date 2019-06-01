function Context() {
  this.events = {}
  this.ctx = null
  this.user = {
    name: '',
    phone: '',
    customQuestion: '',
  }
}
Context.prototype.getName = function() {
  return this.user.name
}

Context.prototype.setName = function(name) {
  this.user.name = name
}
Context.prototype.getPhone = function() {
  return this.user.phone
}
Context.prototype.setPhone = function(phone) {
  this.user.phone = phone
}

Context.prototype.getCustomQuestion = function() {
  return this.user.customQuestion
}
Context.prototype.setCustomQuestion = function(cq) {
  this.user.customQuestion = cq
}
Context.prototype.getUser = function() {
  return this.user
}
Context.prototype.clearContext = function() {
  // eslint-disable-next-line

  // eslint-disable-next-line
  ;(this.user = {
    name: '',
    phone: '',
    customQuestion: '',
  })(
    // eslint-disable-next-line

    (this.ctx = null),
  )
}

Context.prototype.on = function(eventName, listener) {
  const event = this.events[eventName]
  event ? event.push(listener) : (this.events[eventName] = [listener])
}
Context.prototype.emit = function(eventName, ...data) {
  const event = this.events[eventName]
  if (event) event.forEach(listener => listener(...data))
}
Context.prototype.setContext = function(obj) {
  this.ctx = { ...this.getContext(), ...obj }
}
Context.prototype.getContext = function() {
  return this.ctx
}

function ContextTree() {
  this.nodes = []
}
function Node(data, parent) {
  this.data = data
  this.children = []
  this.parent = parent
  parent && parent.children.push(this)
}
ContextTree.prototype.insert = function(data, parentName) {
  let foundParent = {}
  if (parentName) {
    foundParent = this.nodes.find(node => (node.data.command === parentName ? node : null))
    this.nodes.push(
      new Node(data, foundParent !== undefined && this.nodes.length !== 0 ? foundParent : null),
    )
  } else this.nodes.push(new Node(data, null))
}
ContextTree.prototype.searchContext = function(command) {
  return this.nodes.find(node => (node.data.command === command ? node : null))
}
ContextTree.prototype.getCurrentCtx = function(command) {
  const node = this.searchContext(command)
  return node ? node.data : null
}

const context = new Context()
const ctxTree = new ContextTree()

context.on('changeContext', data => context.setContext(data))

export { context, ctxTree }
