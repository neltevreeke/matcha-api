const User = require('../src/models/User')

const users = [{
  email: 'nelte.p.vreeke@gmail.com',
  password: 'test1234'
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create(user)))
}

module.exports = seed
