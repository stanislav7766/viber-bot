export const context = () => {
  let ctx = null
  const events = {}
  return {
    on: (eventName, listener) => {
      const event = events[eventName]
      if (event) event.push(listener)
      else events[eventName] = [listener]
    },
    emit: (eventName, ...data) => {
      const event = events[eventName]
      if (event) event.forEach(listener => listener(...data))
    },
    setContext: val => (ctx = val),
    getContext: () => ctx,
  }
}
