module.exports = app => {
  app.get('/hello', (req, res) => {
    res.json({
      message: 'hello'
    })
  })

  return app
}
