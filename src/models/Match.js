const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
  sourceUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  likedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }
})

matchSchema.index({ sourceUserId: 1, likedUserId: 1 }, { unique: true })

const Match = mongoose.model('Match', matchSchema)

module.exports = Match
