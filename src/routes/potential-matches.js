const authMiddleware = require('../middleware/auth')
const User = require('../models/User')

module.exports = app => {
  app.get('/potential-matches', authMiddleware, async (req, res) => {
    const potentialMatches = await User
      .find({
        _id: {
          $ne: req.user._id.toString()
        }
      })
      .lean()
      .exec()

    res.json({
      potentialMatches
    })
  })
}
