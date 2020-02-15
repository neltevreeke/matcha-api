const authMiddleware = require('../middleware/auth')

module.exports = app => {
  app.get('/me', authMiddleware, async (req, res, next) => {
    if (req.user.amountReports >= 3) {
      const error = new Error('not-allowed')
      error.statusCode = 403
      return next(error)
    }

    res.json(req.user)
  })
}
