const User = require('../models/User')
const tokenUtils = require('../utils/token')

module.exports = app => {
  app.post('/login', async (req, res, next) => {
    try {
      const {
        email,
        password
      } = req.body

      const user = await User.getAuthenticatedUser(email, password)
      const token = await tokenUtils.create(user._id.toString())

      const userObject = user.toObject()

      if (userObject.amountReports >= 3) {
        const error = new Error('not-allowed')
        error.statusCode = 403
        return next(error)
      }

      delete userObject.password
      delete userObject.__v

      res.json({
        user: userObject,
        token
      })
    } catch (e) {
      next(e)
    }
  })

  return app
}
