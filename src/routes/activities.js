const Activity = require('../models/Activity')
const authMiddleware = require('../middleware/auth')

const getActivities = (userId) => {
  return Activity
    .find({
      $or: [
        { userId: userId },
        { targetUserId: userId }
      ]
    })
    .populate([
      'userId',
      'targetUserId'
    ])
    .sort({
      createdOn: -1
    })
    .lean()
    .exec()
}

module.exports = app => {
  app.get('/activities', authMiddleware, async (req, res) => {
    const userId = req.user._id.toString()

    res.json({
      activities: await getActivities(userId)
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

      res.json({
        activities: await getActivities(userId)
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  }, authMiddleware)
}
