const socketIo = require('socket.io')
const { getDecodedToken } = require('./utils/token')
const User = require('./models/User')
const RoomMessage = require('./models/RoomMessage')
const EventType = require('./constants/EventType')

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

const onEventProfileView = async (io, socket, data) => {
  const user = await User
    .findById(data)
    .select([
      '_id',
      'firstName',
      'lastName',
      'photos'
    ])
    .lean()
    .exec()

  io
    .in(data)
    .emit('event-receive', JSON.stringify({
      type: EventType.EVENT_TYPE_PROFILE_VIEW,
      data: user
    }))
}

const onEventConnect = async (io, socket, data) => {
  const user = await User
    .findById(data)
    .select([
      '_id',
      'firstName',
      'lastName',
      'photos'
    ])
    .lean()
    .exec()

  io
    .in(data)
    .emit('event-receive', JSON.stringify({
      type: EventType.EVENT_TYPE_CONNECT,
      data: user
    }))
}

function initSocketServer (server) {
  const io = socketIo(server)

  io.use(authMiddleware)

  io.on('connection', socket => {
    addOnlineUser(socket.user)

    // By default join room with authenticated userId
    socket.join(socket.user._id.toString())

    io.emit('online-users', JSON.stringify(onlineUsers))

    socket.on('disconnect', () => {
      removeOnlineUser(socket.user)
      io.emit('online-users', JSON.stringify(onlineUsers))
    })

    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId)
    })

    socket.on('event', (event) => {
      if (event.type === EventType.EVENT_TYPE_PROFILE_VIEW) {
        return onEventProfileView(io, socket, event.data)
      } else if (event.type === EventType.EVENT_TYPE_CONNECT) {
        return onEventConnect(io, socket, event.data)
      }
    })

    socket.on('new-message', (message) => {
      const {
        roomId,
        message: content
      } = message

      RoomMessage.create({
        room: roomId,
        createdBy: socket.user,
        content
      })

      socket.join(roomId)

      io
        .in(roomId)
        .emit('received-new-message', JSON.stringify({
          createdBy: socket.user,
          room: roomId,
          content
        }))
    })
  })
}

module.exports = initSocketServer
