const authMiddleware = require('../middleware/auth')
const User = require('../models/User')

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
        gender: {
          $eq: genderPreference.toLowerCase()
        }
      })
      .select([
        '_id',
        'firstName',
        'lastName',
        'age',
        'biography',
        'photos',
        'interests',
        'fameRating'
      ])
      .lean()
      .exec()

    res.json({
      potentialMatches
    })
  })
}
