const Match = require('../models/Match')
const Room = require('../models/Room')

const getMatches = async (userId) => {
  const matches = []

  const connectedMatches = await Match
    .find({
      sourceUserId: userId
    })
    .populate([
      'sourceUserId',
      'likedUserId'
    ])
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

const getOrCreateRoom = async (userId, likedUserId) => {
  const oppositeUserConnection = await Match
    .findOne({
      sourceUserId: likedUserId,
      likedUserId: userId
    })
    .populate([
      'room'
    ])
    .lean()
    .exec()

  if (oppositeUserConnection && oppositeUserConnection.room) {
    return oppositeUserConnection.room
  }

  return Room.create({})
}

module.exports = {
  getMatches,
  getIsMatched,
  getOrCreateRoom
}
