const { getIsMatched, getOrCreateRoom } = require('../utils/matches')
const { dispatchEvent } = require('../socketServer')
const EventType = require('../constants/EventType')
const ActivityType = require('../constants/ActivityType')
const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')
const Room = require('../models/Room')
const RoomMessage = require('../models/RoomMessage')
const Activity = require('../models/Activity')
const { getMatches } = require('../utils/matches')
const sendEmail = require('../utils/sendgrid')

module.exports = app => {
  app.get('/matches', authMiddleware, async (req, res) => {
    const userMatches = await getMatches(req.user._id.toString())

    res.json({
      userMatches
    })
  })

  app.post('/matches', authMiddleware, async (req, res, next) => {
    const sourceUserId = req.user._id.toString()
    const { userId } = req.body

    try {
      const room = await getOrCreateRoom(req.user._id, userId)

      let newMatch = await Match.create({
        sourceUserId,
        likedUserId: userId,
        room: room._id.toString()
      })

      newMatch = await newMatch
        .populate([{
          path: 'sourceUserId',
          select: '-password'
        }, {
          path: 'likedUserId',
          select: '-password'
        }])
        .execPopulate()

      const isMatched = await getIsMatched(sourceUserId, userId)

      const type = isMatched ? EventType.EVENT_TYPE_MATCH : EventType.EVENT_TYPE_CONNECT

      if (type === EventType.EVENT_TYPE_MATCH) {
        await sendEmail(req.user, userId, EventType.EVENT_TYPE_MATCH)
      } else if (type === EventType.EVENT_TYPE_CONNECT) {
        await sendEmail(req.user, userId, EventType.EVENT_TYPE_CONNECT)
      }

      dispatchEvent(userId, type, req.user)

      if (isMatched) {
        dispatchEvent(req.user._id.toString(), type, newMatch.likedUserId)

        await Activity.create({
          userId: req.user._id,
          targetUserId: newMatch.likedUserId._id,
          type: ActivityType.ACTIVITY_TYPE_MATCH
        })
      }

      const connectedMatches = await Match
        .find({
          sourceUserId
        })
        .lean()
        .exec()

      const userMatches = await getMatches(req.user._id.toString())

      res.json({
        connectedMatches,
        userMatches
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })

  app.delete('/matches', authMiddleware, async (req, res, next) => {
    const sourceUserId = req.user._id.toString()
    const {
      userId,
      room
    } = req.body

    try {
      const isMatched = await getIsMatched(sourceUserId, userId)

      if (!isMatched) {
        sendEmail(req.user, userId, EventType.EVENT_TYPE_DISCONNECT)
      }

      await Match.deleteOne({
        sourceUserId,
        likedUserId: userId
      })

      await Match.deleteOne({
        sourceUserId: userId,
        likedUserId: sourceUserId
      })

      if (room) {
        await Room.deleteOne({
          _id: room
        })

        await RoomMessage.deleteMany({
          room
        })
      }

      if (isMatched) {
        dispatchEvent(userId, EventType.EVENT_TYPE_UNMATCH, req.user)

        await Activity.create({
          userId: req.user._id,
          targetUserId: userId,
          type: ActivityType.ACTIVITY_TYPE_UNMATCH
        })

        await sendEmail(req.user, userId, EventType.EVENT_TYPE_UNMATCH)
      }

      const connectedMatches = await Match
        .find({
          sourceUserId
        })
        .lean()
        .exec()

      const userMatches = await getMatches(req.user._id.toString())

      res.json({
        connectedMatches,
        userMatches
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })
}
