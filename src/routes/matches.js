const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')

const getMatchInfo = async (userConnection, reqUserId) => {
  let isMatched = false

  const oppositeUserConnection = await Match.findOne({
    sourceUserId: userConnection.likedUserId._id.toString(),
    likedUserId: reqUserId
  })

  if (oppositeUserConnection) {
    isMatched = true
  }

  return {
    isMatched
  }
}

module.exports = app => {
  app.get('/matches', authMiddleware, async (req, res) => {
    const reqUserId = req.user._id

    const userConnections = await Match
      .find({
        sourceUserId: reqUserId
      })
      .populate([
        'sourceUserId',
        'likedUserId'
      ])
      .lean()
      .exec()

    const userMatches = []

    for (const userConnection of userConnections) {
      const { isMatched } = await getMatchInfo(userConnection, reqUserId)

      if (isMatched) {
        userMatches.push(userConnection)
      }
    }

    res.json({
      userMatches
    })
  })
}
