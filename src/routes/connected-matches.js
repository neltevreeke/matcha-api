const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')
const Room = require('../models/Room')

const getOrCreateRoom = async (userId, likedUserId) => {
  const oppositeUserConnection = await Match
    .findOne({
      sourceUserId: likedUserId,
      likedUserId: userId
    })
    .populate([
      'room'
    ])
    .lean()
    .exec()

  if (oppositeUserConnection && oppositeUserConnection.room) {
    return oppositeUserConnection.room
  }

  return Room.create({})
}

module.exports = app => {
  app.get('/connected-matches', authMiddleware, async (req, res) => {
    const connectedMatches = await Match
      .find({
        sourceUserId: req.user._id
      })
      .lean()
      .exec()

    res.json({
      connectedMatches
    })
  })

  app.post('/connected-matches', authMiddleware, async (req, res, next) => {
    const {
      sourceUserId,
      likedUserId,
      action
    } = req.body

    try {
      if (!action) {
        const room = await getOrCreateRoom(req.user._id, likedUserId)

        await Match.create({
          sourceUserId,
          likedUserId,
          room: room._id.toString()
        })
      } else {
        await Match.deleteOne({
          sourceUserId,
          likedUserId
        })
      }

      const connectedMatches = await Match
        .find({
          sourceUserId
        })
        .lean()
        .exec()

      res.json({
        connectedMatches
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })
}
