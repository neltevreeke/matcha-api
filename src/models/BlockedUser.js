const mongoose = require('mongoose')

const BlockedUser = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  blockedOn: {
    type: Date,
    default: Date.now
  }
})

const Blocked = mongoose.model('Blocked', BlockedUser)

module.exports = Blocked
