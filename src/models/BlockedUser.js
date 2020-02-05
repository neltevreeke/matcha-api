const mongoose = require('mongoose')

const blockedUserSchema = new mongoose.Schema({
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

blockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true })

const Blocked = mongoose.model('Blocked', blockedUserSchema)

module.exports = Blocked
