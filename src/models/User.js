const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  gender: String,
  password: String
})

const User = mongoose.model('Users', UserSchema)

module.exports = User
