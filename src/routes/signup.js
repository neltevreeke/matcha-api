const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.post('/signup', async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      password
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    try {
      await User.create({
        firstName,
        lastName,
        email,
        age,
        gender,
        password: hash
      })

      return res.json({
        message: 'User successfully created'
      })
    } catch (err) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })

  return app
}
