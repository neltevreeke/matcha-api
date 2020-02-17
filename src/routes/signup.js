const User = require('../models/User')
const sgMail = require('@sendgrid/mail')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.post('/signup', async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      password,
      loc
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const verificationToken = await bcrypt.hash(process.env.VERIFICATION_TOKEN_SECRET, salt)

    try {
      await User.create({
        firstName,
        lastName,
        email,
        age,
        gender,
        password,
        loc,
        verificationToken
      })

      const msg = {
        to: email,
        from: 'no-reply@matcha.com',
        subject: 'Account verification',
        html: `Welcome to matcha, <br/>
        It has come to our attention that you signed up with matcha, thank you!<br/>
        By clicking the following link you will be taken to the page where your account gets activated.<br/><br/>
        <a href="http://localhost:3000/verify-account?token=${verificationToken}">Activate my account!</a><br/><br/>

        Kind regards, matcha
      `
      }

      await sgMail.send(msg)

      res.json({
        status: 200
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })

  return app
}
