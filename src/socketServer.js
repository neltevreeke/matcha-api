const socketIo = require('socket.io')
const { getDecodedToken } = require('./utils/token')
const User = require('./models/User')

let onlineUsers = []

const addOnlineUser = user => {
  const hasUser = onlineUsers.some(u => u._id.toString() === user._id.toString())

  if (hasUser) {
    return onlineUsers
  }

  onlineUsers.push(user)
}

const removeOnlineUser = (user) => {
  onlineUsers = onlineUsers.filter(onlineUser => user._id.toString() !== onlineUser._id.toString())
  return onlineUsers
}

const authMiddleware = async (socket, next) => {
  const token = socket.handshake.query.token

  if (!token) {
    return next(new Error('auth'))
  }

  const decodedToken = await getDecodedToken(token)

  if (!decodedToken.userId) {
    return next(new Error('auth'))
  }

  const { userId } = decodedToken

  const user = await User
    .findById(userId)
    .lean()
    .exec()

  if (!user) {
    return next(new Error('auth'))
  }

  delete user.password
  delete user.__v

  socket.user = user
  next()
}

function initSocketServer (server) {
  const io = socketIo(server)

  io.use(authMiddleware)

  io.on('connection', socket => {
    addOnlineUser(socket.user)

    io.emit('server message', JSON.stringify(onlineUsers))

    socket.on('disconnect', () => {
      removeOnlineUser(socket.user)
      io.emit('server message', JSON.stringify(onlineUsers))
    })
  })
}

module.exports = initSocketServer
