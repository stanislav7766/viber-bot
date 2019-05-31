function Context() {
  const events = {}
  this.events = events
  this.ctx = null
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
const context = new Context()
context.on('changeContext', data => context.setContext(data))
export { context }
