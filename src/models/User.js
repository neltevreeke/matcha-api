const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Gender = require('../constants/Gender')
const GenderPreference = require('../constants/GenderPreference')

const interestSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  }
}, {
  _id: false
})

const photoSchema = new mongoose.Schema({
  cloudinaryPublicId: String,
  order: Number
}, {
  _id: false
})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  gender: {
    type: String,
    enum: Object.values(Gender)
  },
  password: String,
  biography: String,
  lastSeen: {
    type: Date,
    default: Date.now
  },
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  interests: [interestSchema],
  photos: [photoSchema],
  fameRating: Number,
  minDistance: Number,
  maxDistance: Number,
  minAge: Number,
  maxAge: Number,
  minFameRating: Number,
  maxFameRating: Number,
  minTags: Number,
  maxTags: Number,
  genderPreference: {
    type: String,
    enum: Object.values(GenderPreference),
    default: GenderPreference.BISEXUAL
  },
  amountReports: 0
})

userSchema.index({ loc: '2dsphere' })

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})

userSchema.statics.getAuthenticatedUser = async function (email, password) {
  const user = await this.findOne({
    email
  })

  if (!user || !user.password) {
    const error = new Error('not-found')
    error.statusCode = 404
    throw error
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    const error = new Error('not-found')
    error.statusCode = 404
    throw error
  }

  return user
}

const User = mongoose.model('Users', userSchema)

module.exports = User
