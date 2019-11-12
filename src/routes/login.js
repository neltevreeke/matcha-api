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

      delete user.password
      delete user.__v

      res.json({
        user,
        token
      })
    } catch (e) {
      next(e)
    }
  })

  return app
}
