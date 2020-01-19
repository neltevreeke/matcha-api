const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')
const Room = require('../models/Room')
const { dispatchEvent } = require('../socketServer')
const EventType = require('../constants/EventType')
const { getIsMatched } = require('../utils/matches')

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

        let newMatch = await Match.create({
          sourceUserId,
          likedUserId,
          room: room._id.toString()
        })

        newMatch = await newMatch
          .populate([
            'sourceUserId',
            'likedUserId'
          ])
          .execPopulate()

        const isMatched = await getIsMatched(sourceUserId, likedUserId)

        const type = isMatched ? EventType.EVENT_TYPE_MATCH : EventType.EVENT_TYPE_CONNECT

        dispatchEvent(likedUserId, type, req.user)

        if (isMatched) {
          dispatchEvent(req.user._id.toString(), type, newMatch.likedUserId)
        }
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
