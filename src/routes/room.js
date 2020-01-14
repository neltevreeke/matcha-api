const authMiddleware = require('../middleware/auth')
const RoomMessage = require('../models/RoomMessage')

module.exports = app => {
  // TODO: add pagination...

  app.get('/rooms/:id/message', authMiddleware, async (req, res) => {
    const { id } = req.params

    const roomMessages = await RoomMessage
      .find({
        room: id
      })
      .populate(
        'createdBy'
      )
      .lean()
      .exec()

    res.json(roomMessages)
  })
}
