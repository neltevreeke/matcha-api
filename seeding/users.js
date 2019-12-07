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
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  photos: [{
    cloudinaryPublicId: 'user-photos/zt2acs6aqjobmmmlivwk'
  }, {
    cloudinaryPublicId: 'user-photos/q2rmpri95moli67u6rgn'
  }],
  interests: [{
    label: 'Make-up'
  }, {
    label: 'music'
  }],
  fameRating: 76
}, {
  email: 'mike@mike.nl',
  password: 'test',
  firstName: 'Mike',
  lastName: 'Vercoelen',
  age: 53,
  gender: Gender.MALE,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'cars'
  }, {
    label: 'hardware'
  }, {
    label: 'Programming'
  }],
  fameRating: 4
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create(user)))
}

module.exports = seed
