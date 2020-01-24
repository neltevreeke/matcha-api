const { getDecodedToken } = require('../utils/token')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const tokenHeader = req.headers['x-token']

  if (!tokenHeader) {
    const error = new Error('not-allowed')
    error.statusCode = 401
    return next(error)
  }

  try {
    const token = await getDecodedToken(tokenHeader)

    if (!token) {
      const error = new Error('not-allowed')
      error.statusCode = 401
      return next(error)
    }

    const user = await User
      .findById(token.userId)
      .lean()
      .exec()

    if (!user) {
      const error = new Error('not-allowed')
      error.statusCode = 401
      return next(error)
    }

    delete user.password
    delete user.__v

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
