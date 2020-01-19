const Match = require('../models/Match')

const getMatches = async (userId) => {
  const matches = []

  const connectedMatches = await Match
    .find({
      sourceUserId: userId
    })
    .lean()
    .exec()

  for (const connectedMatch of connectedMatches) {
    const isMatched = await Match.findOne({
      sourceUserId: connectedMatch.likedUserId._id.toString(),
      likedUserId: userId
    })
      .lean()
      .exec()

    if (isMatched) {
      matches.push(connectedMatch)
    }
  }

  return matches
}

const getIsMatched = async (userId, likedUserId) => {
  const matches = await getMatches(userId)

  // if something is buggy with notifications, this might be the cause.
  return matches.some(m => m.likedUserId.toString() === likedUserId.toString())
}

module.exports = {
  getMatches,
  getIsMatched
}
