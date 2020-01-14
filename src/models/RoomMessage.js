const mongoose = require('mongoose')

const roomMessageSchema = mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    index: true
  },
  content: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  }
})

roomMessageSchema.pre('save', function (next) {
  this.changed = new Date()
  next()
})

const RoomMessage = mongoose.model('RoomMessage', roomMessageSchema)

module.exports = RoomMessage
