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
  firstName: 'Hetero',
  lastName: 'Woman',
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
  fameRating: 76,
  genderPreference: 'MALE'
}, {
  email: 'gay@male.nl',
  password: 'test',
  firstName: 'Gay',
  lastName: 'Male',
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
  fameRating: 4,
  genderPreference: 'MALE'
}, {
  email: 'lol@lol.nl',
  password: 'test',
  firstName: 'Gay',
  lastName: 'Woman',
  age: 53,
  gender: Gender.WOMAN,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'being gay'
  }, {
    label: 'gay testing'
  }, {
    label: 'test'
  }],
  fameRating: 18,
  genderPreference: 'FEMALE'
}, {
  email: 'hetero@guy.nl',
  password: 'test',
  firstName: 'Hetero',
  lastName: 'Guy',
  age: 70,
  gender: Gender.MALE,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'test'
  }, {
    label: 'test'
  }, {
    label: 'testest'
  }],
  fameRating: 88,
  genderPreference: 'FEMALE'
}, {
  email: 'bi@woman.nl',
  password: 'test',
  firstName: 'Woman',
  lastName: 'isBi',
  age: 53,
  gender: Gender.FEMALE,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'males'
  }, {
    label: 'females'
  }, {
    label: 'bisexual'
  }],
  fameRating: 4,
  genderPreference: 'BISEXUAL'
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create(user)))
}

module.exports = seed
