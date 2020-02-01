const authMiddleware = require('../middleware/auth')
const User = require('../models/User')
const GenderPreference = require('../constants/GenderPreference')
const Gender = require('../constants/Gender')

const getSortBy = key => (a, b) => {
  if (a[key] > b[key]) return -1
  if (b[key] > a[key]) return 1

  return 0
}

const getSortedMatches = (matches, sortBy) => {
  if (sortBy === 'age') {
    return matches.sort(getSortBy('age'))
  } else if (sortBy === 'fame-rating') {
    return matches.sort(getSortBy('fameRating'))
  }

  return matches
}

module.exports = app => {
  app.get('/potential-matches', authMiddleware, async (req, res) => {
    // todo: Update query and userModel
    // use:
    // matching interest tags (minTags, maxTags)

    const { sortBy } = req.query

    const {
      minAge,
      maxAge,
      maxDistance,
      // minTags,
      // maxTags,
      minFameRating,
      maxFameRating,
      genderPreference,
      loc
    } = req.user

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
            [loc[0], loc[1]],
            maxDistance / 6378.1
          ]
        }
      }
    }

    const reqUserId = req.user._id.toString()

    const potentialMatches = await User
      .find({
        _id: {
          $ne: reqUserId
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
        'gender'
      ])
      .lean()
      .exec()

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
      filteredPotentialMatches: getSortedMatches(filteredPotentialMatches, sortBy)
    })
  })
}
