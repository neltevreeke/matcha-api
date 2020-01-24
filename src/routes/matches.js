const { getIsMatched, getOrCreateRoom } = require('../utils/matches')
const { dispatchEvent } = require('../socketServer')
const EventType = require('../constants/EventType')
const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')
const { getMatches } = require('../utils/matches')

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
        .populate([
          'sourceUserId',
          'likedUserId'
        ])
        .execPopulate()

      const isMatched = await getIsMatched(sourceUserId, userId)

      const type = isMatched ? EventType.EVENT_TYPE_MATCH : EventType.EVENT_TYPE_CONNECT

      dispatchEvent(userId, type, req.user)

      if (isMatched) {
        dispatchEvent(req.user._id.toString(), type, newMatch.likedUserId)
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
    const { userId } = req.body

    try {
      const isMatched = await getIsMatched(sourceUserId, userId)

      await Match.deleteOne({
        sourceUserId,
        likedUserId: userId
      })

      if (isMatched) {
        dispatchEvent(userId, EventType.EVENT_TYPE_UNMATCH, req.user)
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
