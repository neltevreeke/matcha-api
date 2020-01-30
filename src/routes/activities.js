const Activity = require('../models/Activity')
const authMiddleware = require('../middleware/auth')

module.exports = app => {
  app.get('/activites', authMiddleware, async (req, res) => {
    const activities = await Activity.find({
      $or: [
        { userId: req.user._id },
        { targetUserId: req.user._id }
      ]
    })

    res.json({
      activities
    })
  })

  // app.post('/activities', authMiddleware, async (req, res) => {
  //   console.log(req.user)
  // })
}
