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
      'targetUserId',
      'seenBy'
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

  app.post('/activities/seen', authMiddleware, async (req, res, next) => {
    const userId = req.user._id.toString()
    const {
      activityIds
    } = req.body

    if (!activityIds.length) {
      return res.sendStatus(200)
    }

    for (const activityId of activityIds) {
      await Activity.updateOne({
        _id: activityId
      }, {
        $addToSet: {
          seenBy: userId
        }
      })
    }

    res.sendStatus(200)
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
