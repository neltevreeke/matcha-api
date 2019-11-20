const User = require('../models/User')
const { getDecodedToken } = require('../utils/token')
const authMiddleware = require('../middleware/auth')

module.exports = app => {
  app.post('/update', authMiddleware, async (req, res, next) => {
    const tokenHeader = req.headers['x-token']
    const token = await getDecodedToken(tokenHeader)
    const userId = token.userId

    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      biography
    } = req.body

    try {
      const user = await User.findOneAndUpdate({ _id: userId }, {
        firstName,
        lastName,
        email,
        age,
        gender,
        biography
      }, { new: true })

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
