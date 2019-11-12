const mongoose = require('mongoose')
const config = require('../src/config')
const seeding = require('../seeding')

const connect = () => {
  return mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    promiseLibrary: global.Promise,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}

const seed = async () => {
  await connect()
  await mongoose.connection.db.dropDatabase()
  await Promise.all(seeding.map(seed => seed()))
  await mongoose.connection.close()
}

seed()
