const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  age: Number,
  gender: String
})

const User = mongoose.model('users', UserSchema)

module.exports = User
