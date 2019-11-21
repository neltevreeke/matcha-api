const cloudinaryUtils = require('../utils/cloudinary')

module.exports = app => {
  app.post('/cloudinary/sign', async (req, res, next) => {
    const {
      timestamp,
      uploadPreset
    } = req.body

    const signature = await cloudinaryUtils.getSignature({
      timestamp,
      upload_preset: uploadPreset
    })

    res.json({
      signature
    })
  })
}
