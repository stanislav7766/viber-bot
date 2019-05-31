const keepUserData = () => {
  const user = {
    name: '',
    phone: '',
  }
  return {
    setName: name => {
      user.name = name
    },
    setPhone: phone => {
      user.phone = phone
    },
    getUser: () => user,
  }
}
const user = keepUserData()
export { user }
