const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')

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
}
