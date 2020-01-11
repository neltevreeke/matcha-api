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
  }],
  loc: {
    coordinates: [52.374267, 4.915762]
  },
  fameRating: 2
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
  genderPreference: 'MALE',
  loc: {
    coordinates: [52.370216, 4.895168]
  }
  // amsterdam
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
  genderPreference: 'MALE',
  loc: {
    coordinates: [51.350784, 5.264702]
  }
}, {
  email: 'lol@lol.nl',
  password: 'test',
  firstName: 'Gay',
  lastName: 'Woman',
  age: 53,
  gender: Gender.FEMALE,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'being gay'
  }, {
    label: 'gay testing'
  }, {
    label: 'test'
  }],
  fameRating: 18,
  genderPreference: 'FEMALE',
  loc: {
    coordinates: [52.350784, 5.264702]
  }
  // almere
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
  genderPreference: 'FEMALE',
  loc: {
    coordinates: [52.292790, 4.907460]
  }
  // Oudekerk aan de amstel
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
  genderPreference: 'BISEXUAL',
  loc: {
    coordinates: [52.077930, 5.125520]
  }
  // utrecht
}, {
  email: 'woman@woman.nl',
  password: 'test',
  firstName: 'Man',
  lastName: 'isBi',
  age: 53,
  gender: Gender.MALE,
  biography: 'Lorem Ipsum is slechts een proeftekst uit het drukkerij- en zetterijwezen. Lorem Ipsum is de standaard proefteksttttttttttttdadwawdawdaaaaaa',
  interests: [{
    label: 'males'
  }, {
    label: 'females'
  }, {
    label: 'bisexual'
  }],
  fameRating: 4,
  genderPreference: 'BISEXUAL',
  loc: {
    coordinates: [51.957270, 5.220610]
  }
  // culemborg
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create(user)))
}

module.exports = seed
