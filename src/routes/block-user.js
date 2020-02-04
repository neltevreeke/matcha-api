const authMiddleware = require('../middleware/auth')
const Blocked = require('../models/BlockedUser')

const getBlockedUsers = (userId) => {
  return Blocked.find({
    userId
  })
    .populate([
      'userId',
      'blockedUserId'
    ])
    .sort({
      blockedOn: -1
    })
    .lean()
    .exec()
}

module.exports = app => {
  app.get('/block-user', authMiddleware, async (req, res) => {
    const userId = req.user._id.toString()

    res.json({
      blockedUsers: await getBlockedUsers(userId)
    })
  })

  app.post('/block-user', authMiddleware, async (req, res) => {
    const userId = req.user._id.toString()

    const {
      blockedUserId
    } = req.body

    Blocked.create({
      userId,
      blockedUserId
    })

    res.json({
      blockedUsers: await getBlockedUsers(userId)
    })
  })
}
