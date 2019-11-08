const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = app => {
  app.post('/signup', (req, res) => {
  })

  app.post('/login', async (req, res) => {
    let foundUser

    try {
      foundUser = await User.findOne({
        'email': req.body.email
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }

    if (!foundUser) {
      // res.status(404).send({
      //   message: 'Email does not exist'
      // })

      return res.json({
        message: 'Email does not exist'
      })
    }

    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      // res.status(409).send({
      //   message: 'Passwords do not match'
      // })

      return res.json({
        message: 'Passwords do not match'
      })
    }

    const token = jwt.sign(foundUser.toJSON(), process.env.JWT_SECRET)

    res.json({
      token
    })

    // res.status(200).send({
    //   message: 'Log in succesfull',
    //   token
    // })
  })

  return app
}
