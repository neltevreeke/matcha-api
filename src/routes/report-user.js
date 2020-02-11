const authMiddleware = require('../middleware/auth')
const Reported = require('../models/ReportedUser')
const User = require('../models/User')

const getReportedUsers = (userId) => {
  return Reported.find({
    userId
  })
    .populate([{
      path: 'userId',
      select: '-password'
    }, {
      path: 'reportedUserId',
      select: '-password'
    }])
    .lean()
    .exec()
}

module.exports = app => {
  app.get('/report-user', authMiddleware, async (req, res, next) => {
    const userId = req.user._id.toString()

    res.json({
      reportedUsers: await getReportedUsers(userId)
    })
  })

  app.post('/report-user', authMiddleware, async (req, res, next) => {
    const userId = req.user._id.toString()

    const {
      reportedUserId
    } = req.body

    try {
      await Reported.create({
        userId,
        reportedUserId
      })

      await User.findByIdAndUpdate({
        _id: reportedUserId
      }, {
        $inc: { amountReports: 1 }
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }

    res.json({
      reportedUsers: await getReportedUsers(userId)
    })
  })
}
