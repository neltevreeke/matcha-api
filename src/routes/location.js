const authMiddleware = require('../middleware/auth')
const fetch = require('node-fetch')

module.exports = app => {
  app.get('/location', authMiddleware, async (req, res, next) => {
    try {
      await fetch('https://jsonip.com', {
        mode: 'cors'
      })
        .then((resp) => resp.json())
        .then(async (ip) => {
          await fetch('http://ip-api.com/json/' + ip.ip, {
            method: 'GET',
            mode: 'cors'
          })
            .then((resp) => resp.json())
            .then((coords) => {
              res.json({
                lat: coords.lat,
                long: coords.lon
              })
            })
        })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 503
      return next(error)
    }
  })
}
