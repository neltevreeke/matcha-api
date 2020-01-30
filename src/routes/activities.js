const Activity = require('../models/Activity')
const authMiddleware = require('../middleware/auth')

module.exports = app => {
  app.get('/activities', authMiddleware, async (req, res) => {
    let activities = await Activity
      .find({
        $or: [
          { userId: req.user._id },
          { targetUserId: req.user._id }
        ]
      })
      .populate([
        'userId',
        'targetUserId'
      ])
      .lean()
      .exec()

    activities = activities.reverse()

    res.json({
      activities
    })
  })

  app.post('/activities', authMiddleware, async (req, res, next) => {
    const userId = req.user._id.toString()
    const {
      targetUserId,
      type
    } = req.body

    try {
      await Activity.create({
        userId,
        targetUserId,
        type
      })

      let activities = await Activity
        .find({
          $or: [
            { userId },
            { targetUserId: userId }
          ]
        })
        .populate([
          'userId',
          'targetUserId'
        ])
        .lean()
        .exec()

      activities = activities.reverse()

      res.json({
        activities
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })
}
