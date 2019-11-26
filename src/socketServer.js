const socketIo = require('socket.io')

function initSocketServer (server) {
  const io = socketIo(server)

  io.on('connection', socket => {
    const online = Object.keys(io.engine.clients)
    io.emit('server message', JSON.stringify(online))

    socket.on('disconnect', () => {
      const online = Object.keys(io.engine.clients)
      io.emit('server message', JSON.stringify(online))
    })
  })
}

module.exports = initSocketServer
