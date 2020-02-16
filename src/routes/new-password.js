const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.post('/new-password', async (req, res, next) => {
    const {
      token,
      password
    } = req.body.newPassword

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    await User.findOneAndUpdate({
      passwordResetToken: token
    }, {
      password: hashPassword
    })

    res.json({
      status: 200
    })
  })
}
