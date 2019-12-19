const authMiddleware = require('../middleware/auth')
const Match = require('../models/Match')

module.exports = app => {
  app.get('/get-matches', authMiddleware, async (req, res) => {
    const userMatches = await Match
      .find({
        sourceUserId: req.user._id
      })
      .populate([
        'sourceUserId',
        'likedUserId'
      ])
      .lean()
      .exec()
  })
}

// const getMatchInfo = async (potentialMatch, userConnections, reqUserId) => {
//   let isMatched = false
//   let isConnected = false
//
//   for (const userConnection of userConnections) {
//     if (potentialMatch._id.toString() === userConnection.likedUserId._id.toString()) {
//       const oppositeUserConnection = await Match.findOne({
//         sourceUserId: userConnection.likedUserId._id.toString(),
//         likedUserId: reqUserId
//       })
//
//       if (oppositeUserConnection) {
//         isMatched = true
//         break
//       }
//
//       isConnected = true
//     }
//   }
//
//   return {
//     isMatched,
//     isConnected
//   }
// }
