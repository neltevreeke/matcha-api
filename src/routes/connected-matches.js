const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')

module.exports = app => {
  app.post('/connected-matches', authMiddleware, async (req, res, next) => {
    const {
      sourceUserId,
      likedUserId
    } = req.body

    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    const currentDate = dd + '/' + mm + '/' + yyyy

    try {
      await Match.create({
        sourceUserId,
        likedUserId,
        date: currentDate
      })

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
