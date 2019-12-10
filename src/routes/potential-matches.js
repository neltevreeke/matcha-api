const authMiddleware = require('../middleware/auth')
const User = require('../models/User')
const GenderPreference = require('../constants/GenderPreference')
const Gender = require('../constants/Gender')

module.exports = app => {
  app.get('/potential-matches', authMiddleware, async (req, res) => {
    // todo: Update query and userModel
    // use:
    // distance (minDistance, maxDistance)
    // matching interest tags (minTags, maxTags)
    // bisexuality

    const {
      minAge,
      maxAge,
      // minDistance,
      // maxDistance,
      // minTags,
      // maxTags,
      minFameRating,
      maxFameRating,
      genderPreference
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

    const potentialMatches = await User
      .find({
        _id: {
          $ne: req.user._id.toString()
        },
        age: {
          $lte: maxAge,
          $gte: minAge
        },
        fameRating: {
          $lte: maxFameRating,
          $gte: minFameRating
        },
        ...genderQuery
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
        'genderPreference'
      ])
      .lean()
      .exec()

    potentialMatches.filter(match => {
      if (match.genderPreference !== req.user.gender && req.user.genderPreference !== match.gender) {
        return false
      } else if (req.user.genderPreference === GenderPreference.BISEXUAL && match.genderPreference !== req.user.gender) {
        return false
      } else if (match.genderPreference === GenderPreference.BISEXUAL && match.genderPreference !== req.user.gender) {
        return false
      }
    })

    res.json({
      potentialMatches
    })
  })
}
