const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  createdOn: {
    type: Date,
    default: Date.now
  }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room
