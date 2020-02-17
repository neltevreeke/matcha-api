const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.post('/verify-account', async (req, res, next) => {
    const {
      token
    } = req.body

    const compareToken = await bcrypt.compare(process.env.VERIFICATION_TOKEN_SECRET, token)

    if (compareToken) {
      await User.findOneAndUpdate({
        verificationToken: token
      }, {
        verified: true
      })
    }

    res.json({
      status: 200
    })
  })
}
