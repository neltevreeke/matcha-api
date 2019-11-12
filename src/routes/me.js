const authMiddleware = require('../middleware/auth')

module.exports = app => {
  app.get('/me', authMiddleware, async (req, res) => {
    res.json(req.user)
  })
}
