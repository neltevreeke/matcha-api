const cloudinary = require('cloudinary')
const config = require('../config')

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET
})

const getSignature = (params) => {
  return cloudinary.utils.api_sign_request(params, config.CLOUDINARY_SECRET)
}

module.exports = {
  getSignature
}
