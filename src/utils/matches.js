const Match = require('../models/Match')
const Room = require('../models/Room')
const Blocked = require('../models/BlockedUser')
const geolib = require('geolib')

const getBlockedUserIds = async (userId) => {
  let blockedUserIds = await Blocked.find({
    userId
  })
    .select([
      'blockedUserId'
    ])
    .lean()
    .exec()

  blockedUserIds = blockedUserIds.map((blockedUser) => {
    return blockedUser.blockedUserId
  })

  return blockedUserIds
}

const whoBlockedMeIds = async (userId) => {
  let blockerIds = await Blocked.find({
    blockedUserId: userId
  })
    .select([
      'userId'
    ])
    .lean()
    .exec()

  blockerIds = blockerIds.map((blocker) => {
    return blocker.userId
  })

  return blockerIds
}

const getMatches = async (userId) => {
  const matches = []

  const connectedMatches = await Match
    .find({
      sourceUserId: userId
    })
    .populate([{
      path: 'sourceUserId',
      select: '-password'
    }, {
      path: 'likedUserId',
      select: '-password'
    }])
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
  return matches.some(m => m.likedUserId._id.toString() === likedUserId.toString())
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

const setAmountCommonInterests = (userInterests, matchInterests, match) => {
  match.amountCommonInterests = 0

  userInterests.filter(element => {
    matchInterests.map(interest => {
      if (interest.label === element.label) {
        match.amountCommonInterests = match.amountCommonInterests + 1
      }
    })
  })
}

const setTagsInCommon = (userInterests, matches) => {
  matches.map(match => {
    setAmountCommonInterests(userInterests, match.interests, match)
  })
}

const setDistanceFromUser = (userLoc, matches) => {
  const {
    coordinates
  } = userLoc

  matches.map(match => {
    match.distanceFromUser = geolib.getDistance(coordinates, match.loc.coordinates)
  })
}

module.exports = {
  getMatches,
  getIsMatched,
  getOrCreateRoom,
  getBlockedUserIds,
  whoBlockedMeIds,
  setDistanceFromUser,
  setTagsInCommon
}
