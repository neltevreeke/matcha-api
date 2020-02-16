const bcrypt = require('bcryptjs')
const User = require('../models/User')
const sgMail = require('@sendgrid/mail')

module.exports = app => {
  app.post('/reset-password', async (req, res, next) => {
    const {
      email
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const passwordResetToken = await bcrypt.hash(process.env.PASSWORD_RESET_TOKEN_SECRET, salt)

    await User.findOneAndUpdate({
      email
    }, {
      passwordResetToken
    })

    const msg = {
      to: email,
      from: 'no-reply@matcha.com',
      subject: 'Password reset requested',
      html: `Dear user, <br/>
        It has come to our attention that you forgot your password!<br/>
        By clicking the following link you will be taken to the page where you can enter your new password.<br/><br/>
        <a href="http://localhost:3000/new-password?token=${passwordResetToken}">Reset my password!</a>

        Kind regards, matcha
      `
    }

    await sgMail.send(msg)

    res.json({
      status: 200
    })
  })
}
