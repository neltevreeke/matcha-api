const mongoose = require('mongoose')
const http = require('http')
const config = require('./config')
const app = require('./app')
const { initSocketServer } = require('./socketServer')

const startServer = async () => {
  try {
    const server = http.createServer(app)
    initSocketServer(server)

    await Promise.all([
      mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        promiseLibrary: global.Promise,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      }),
      server.listen(config.PORT)
    ])

    // eslint-disable-next-line no-console
    console.log(`Server has started on port: ${config.PORT}, connected to mongo at ${config.MONGODB_URI}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message)
  }
}

startServer()
