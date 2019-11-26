const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const { removeImage } = require('../utils/cloudinary')

module.exports = app => {
  app.post('/update', authMiddleware, async (req, res, next) => {
    try {
      if (req.body.deletedPhoto) {
        await removeImage(req.body.deletedPhoto.cloudinaryPublicId)
        delete req.body.deletedPhoto.cloudinaryPublicId
      }

      const user = await User.findByIdAndUpdate(req.user._id.toString(), req.body, { new: true })
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
