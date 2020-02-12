const User = require('../src/models/User')
const Gender = require('../src/constants/Gender')
const GenderPreference = require('../src/constants/GenderPreference')

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
  lastSeen: '2020-02-03T13:36:21.679Z',
  genderPreference: GenderPreference.FEMALE,
  fameRating: 10,
  loc: {
    type: 'Point',
    coordinates: [
      52.374323699999997928,
      4.915795099999999529
    ]
  }
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
  lastSeen: '2020-02-03T13:20:16.679Z',
  interests: [{
    label: 'Make-up'
  }, {
    label: 'music'
  }],
  fameRating: 24,
  loc: {
    type: 'Point',
    coordinates: [
      52.370216,
      4.895168
    ]
  },
  // amsterdam
  amountReports: 0,
  emailNotifications: {
    connect: true,
    disconnect: true,
    match: true,
    unmatch: true,
    block: true,
    unblock: true,
    profileView: true,
    report: true
  }
}, {
  email: 'gay@male.nl',
  password: 'test',
  firstName: 'Gay',
  lastName: 'Male',
  lastSeen: '2020-01-03T12:36:21.679Z',
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
  genderPreference: GenderPreference.MALE,
  fameRating: 70,
  loc: {
    type: 'Point',
    coordinates: [
      51.350784,
      5.264702
    ]
  },
  amountReports: 0
}, {
  email: 'lol@lol.nl',
  password: 'test',
  firstName: 'Gay',
  lastName: 'Woman',
  lastSeen: '2020-02-01T10:36:21.679Z',
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
  genderPreference: GenderPreference.FEMALE,
  fameRating: 20,
  loc: {
    type: 'Point',
    coordinates: [
      52.350784,
      5.264702
    ]
  },
  // almere
  amountReports: 0
}, {
  email: 'hetero@guy.nl',
  password: 'test',
  firstName: 'Hetero',
  lastName: 'Guy',
  lastSeen: '2020-01-03T13:36:21.679Z',
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
  genderPreference: GenderPreference.FEMALE,
  fameRating: 10,
  loc: {
    type: 'Point',
    coordinates: [
      52.292790,
      4.907460
    ]
  },
  // Oudekerk aan de amstel
  amountReports: 0
}, {
  email: 'bi@woman.nl',
  password: 'test',
  firstName: 'Woman',
  lastName: 'isBi',
  lastSeen: '2020-02-03T09:36:21.679Z',
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
  genderPreference: GenderPreference.BISEXUAL,
  loc: {
    type: 'Point',
    coordinates: [
      52.077930,
      5.125520
    ]
  },
  // utrecht
  amountReports: 0
}, {
  email: 'woman@woman.nl',
  password: 'test',
  firstName: 'Man',
  lastName: 'isBi',
  lastSeen: '2020-02-03T11:36:21.679Z',
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
  genderPreference: GenderPreference.BISEXUAL,
  fameRating: 56,
  loc: {
    type: 'Point',
    coordinates: [
      51.957270,
      5.220610
    ]
  },
  // culemborg
  amountReports: 0
}]

const seed = async () => {
  return Promise.all(users.map(user => User.create({
    ...user,
    fameRating: 4,
    minDistance: 0,
    maxDistance: 50,
    minAge: 18,
    maxAge: 99,
    minFameRating: 0,
    maxFameRating: 200
  })))
}

module.exports = seed
