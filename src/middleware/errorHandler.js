const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'internal-server-error'

  res.status(statusCode)
  res.json({
    message
  })

  res.status(500)
}

module.exports = errorHandler
