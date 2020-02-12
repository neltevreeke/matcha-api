const authMiddleware = require('../middleware/auth')
const User = require('../models/User')
const GenderPreference = require('../constants/GenderPreference')
const Gender = require('../constants/Gender')
const {
  getBlockedUserIds,
  whoBlockedMeIds,
  getDistanceFromUser
} = require('../utils/matches')

// lowest value first
// example when sorted by age: [youngest, ..., oldest]
const getSortBy = key => (a, b) => {
  if (a[key] > b[key]) return 1
  if (b[key] > a[key]) return -1

  return 0
}

const getSortedMatches = (userLoc, matches, sortBy) => {
  if (sortBy === 'age') {
    return matches.sort(getSortBy('age'))
  } else if (sortBy === 'fame-rating') {
    return matches.sort(getSortBy('fameRating'))
  } else if (sortBy === 'location') {
    const matchesDistanceFromYou = getDistanceFromUser(userLoc, matches)

    return matchesDistanceFromYou.sort(getSortBy('distanceFromUser'))
  } else if (sortBy === 'tags-in-common') {
    // todo: calculate amount of tags in common
    // const matchesTagsInCommon = getTagsInCommon()

    return matches.sort(getSortBy('interests'))
  }

  return matches
}

module.exports = app => {
  app.get('/potential-matches', authMiddleware, async (req, res, next) => {
    // todo: Update query and userModel
    // use:
    // matching interest tags (minTags, maxTags)

    const { sortBy } = req.query

    const {
      minAge,
      maxAge,
      maxDistance,
      // todo: calculate amount of tags in common, if between min and max return otherwise filter out user
      // minTags,
      // maxTags,
      minFameRating,
      maxFameRating,
      genderPreference,
      loc
    } = req.user

    const blockedUserIds = await getBlockedUserIds(req.user._id)
    const blockerIds = await whoBlockedMeIds(req.user._id)

    let genderQuery = {}

    if (genderPreference === GenderPreference.MALE) {
      genderQuery = {
        gender: Gender.MALE
      }
    } else if (genderPreference === GenderPreference.FEMALE) {
      genderQuery = {
        gender: Gender.FEMALE
      }
    } else if (genderPreference === GenderPreference.BISEXUAL) {
      genderQuery = {
        $or: [{
          gender: Gender.MALE
        }, {
          gender: Gender.FEMALE
        }]
      }
    }

    const locationQuery = {
      loc: {
        $geoWithin: {
          $centerSphere: [
            [loc.coordinates[0], loc.coordinates[1]],
            maxDistance / 6378.1
          ]
        }
      }
    }

    const reqUserId = req.user._id.toString()

    let potentialMatches
    try {
      potentialMatches = await User
        .find({
          _id: {
            $ne: reqUserId,
            $nin: [...blockedUserIds, ...blockerIds]
          },
          age: {
            $lte: maxAge,
            $gte: minAge
          },
          fameRating: {
            $lte: maxFameRating,
            $gte: minFameRating
          },
          ...genderQuery,
          ...locationQuery
        })
        .select([
          '_id',
          'firstName',
          'lastName',
          'age',
          'biography',
          'photos',
          'interests',
          'fameRating',
          'genderPreference',
          'gender',
          'loc',
          'lastSeen'
        ])
        .lean()
        .exec()
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 404
      return next(error)
    }

    const filteredPotentialMatches = potentialMatches.filter(match => {
      const matchIsBisexual = match.genderPreference === GenderPreference.BISEXUAL
      const userIsBisexual = req.user.genderPreference === GenderPreference.BISEXUAL

      const userIsGay = req.user.gender === Gender.MALE && req.user.genderPreference === GenderPreference.MALE
      const matchIsGay = match.gender === Gender.MALE && match.genderPreference === GenderPreference.MALE

      const userIsLesbo = req.user.gender === Gender.FEMALE && req.user.genderPreference === GenderPreference.FEMALE
      const matchIsLesbo = match.gender === Gender.FEMALE && match.genderPreference === GenderPreference.FEMALE

      if (matchIsBisexual && userIsBisexual) {
        return match
      } else if (matchIsBisexual && req.user.genderPreference.toLowerCase() === match.gender) {
        return match
      } else if (userIsBisexual && match.genderPreference.toLowerCase() === req.user.gender) {
        return match
      }

      if (userIsGay && matchIsGay) {
        return match
      }

      if (userIsLesbo && matchIsLesbo) {
        return match
      }

      if (req.user.genderPreference.toLowerCase() === match.gender && match.genderPreference.toLowerCase() === req.user.gender) {
        return match
      }

      return false
    })

    res.json({
      filteredPotentialMatches: getSortedMatches(loc, filteredPotentialMatches, sortBy)
    })
  })
}
