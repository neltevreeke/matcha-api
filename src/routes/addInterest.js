const authMiddleware = require('../middleware/auth')
const User = require('../models/User')
const { getDecodedToken } = require('../utils/token')

module.exports = app => {
  app.post('/addinterest', authMiddleware, async (req, res, next) => {
    const tokenHeader = req.headers['x-token']
    const token = await getDecodedToken(tokenHeader)
    const userId = token.userId

    const {
      tag
    } = req.body

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { interests: { label: tag } } },
        { new: true }
      )

      const userObject = user.toObject()

      delete userObject.password
      delete userObject.__v

      res.json({
        user: userObject
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })

  return app
}
