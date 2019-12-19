const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')

module.exports = app => {
  app.get('/connected-matches', authMiddleware, async (req, res, next) => {
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
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const yyyy = today.getFullYear()

        const currentDate = dd + '/' + mm + '/' + yyyy

        await Match.create({
          sourceUserId,
          likedUserId,
          date: currentDate
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
