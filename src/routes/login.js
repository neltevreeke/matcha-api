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
