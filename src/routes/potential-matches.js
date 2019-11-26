const authMiddleware = require('../middleware/auth')
const User = require('../models/User')
const { getDecodedToken } = require('../utils/token')

module.exports = app => {
  app.get('/potential-matches', authMiddleware, async (req, res, next) => {
    const tokenHeader = req.headers['x-token']
    const token = await getDecodedToken(tokenHeader)
    const userId = token.userId

    const potentialMatches = await User.find({ _id: { $ne: userId } })

    res.json({
      potentialMatches
    })
  })
}
