const mongoose = require('mongoose')

const reportedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
})

reportedUserSchema.index({ userId: 1, reportedUserId: 1 }, { unique: true })

const Reported = mongoose.model('Reported', reportedUserSchema)

module.exports = Reported
