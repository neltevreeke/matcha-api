const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
  url: String,
  order: Number
})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  gender: String,
  password: String,
  biography: String,
  interests: [interestSchema],
  photos: [photoSchema]
})

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
