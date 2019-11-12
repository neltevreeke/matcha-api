const User = require('../models/User')

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

    try {
      await User.create({
        firstName,
        lastName,
        email,
        age,
        gender,
        password
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