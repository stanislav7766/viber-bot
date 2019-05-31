const keepUserData = () => {
  const user = {
    name: '',
    phone: '',
    customQuestion: '',
    status: false,
  }
  return {
    setName: name => {
      user.name = name
    },
    getName: () => user.name,
    setPhone: phone => {
      user.phone = phone
    },
    getPhone: () => user.phone,
    setStatus: status => {
      user.status = status
    },
    getStatus: () => user.status,
    setCustomQuestion: cq => {
      user.customQuestion = cq
    },
    getCustomQuestion: () => user.customQuestion,
    getUser: () => user,
  }
}
const user = keepUserData()
export { user }
