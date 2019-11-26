const User = require('../src/models/User')
const Gender = require('../src/constants/Gender')

const users = [{
  email: 'nelte.p.vreeke@gmail.com',
  password: 'test1234',
  firstName: 'Nelte',
  lastName: 'Vreeke',
  age: 25,
  gender: Gender.MALE,
  biography: 'This is a biography',
  interests: [{
    label: 'Coding'
  }, {
    label: 'Music Production'
  }]
}, {
  email: 'test@test.nl',
  password: 'test',
  firstName: 'Theresa',
  lastName: 'Williams',
  age: 27,
  gender: Gender.FEMALE,
  biography: 'Test biography',
  interests: [{
    label: 'Make-up'
  }, {
    label: 'music'
  }]
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create(user)))
}

module.exports = seed
