const User = require('../models/User')
const { getDecodedToken } = require('../utils/token')
const authMiddleware = require('../middleware/auth')
const { removeImage } = require('../utils/cloudinary')

module.exports = app => {
  app.post('/update', authMiddleware, async (req, res, next) => {
    const tokenHeader = req.headers['x-token']
    const token = await getDecodedToken(tokenHeader)
    const userId = token.userId

    try {
      if (req.body.deletedPhoto) {
        removeImage(req.body.deletedPhoto.cloudinaryPublicId)

        delete req.body.deletedPhoto.cloudinaryPublicId
      }

      const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true })

      const userObject = user.toObject()

      delete userObject.password
      delete userObject.__v

      res.json({
        user: userObject
      })
    } catch (e) {
      const error = new Error('conflict')
      error.statusCode = 409
      return next(error)
    }
  })

  return app
}
