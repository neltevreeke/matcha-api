const User = require('../models/User')
const bcrypt = require('bcryptjs')
const tokenUtils = require('../utils/token')

module.exports = app => {
  app.post('/login', async (req, res, next) => {
    try {
      const {
        email,
        password
      } = req.body

      const user = await User.findOne({
        email
      })

      if (!user) {
        const error = new Error('not-found')
        error.statusCode = 404
        return next(error)
      }

      const isPasswordEqual = await bcrypt.compare(password, user.password)

      if (!isPasswordEqual) {
        const error = new Error('not-found')
        error.statusCode = 404
        return next(error)
      }

      const token = await tokenUtils.create(user._id.toString())

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
