const User = require('../models/User')

const updateFameRating = async (userId) => {
  await User.findByIdAndUpdate({
    _id: userId
  }, {
    $inc: { fameRating: 1 }
  })
}

module.exports = updateFameRating
