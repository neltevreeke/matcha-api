const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  type: {
    type: String
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }]
})

const Activity = mongoose.model('Activity', ActivitySchema)

module.exports = Activity
