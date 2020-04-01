const db = require('../dbConfig')

/**
 * @param io {SocketIO.Server} socket-io instance
 * @description Helper function that configures socket-io instance
 */
exports.configureSocket = io => {
  io.on('connection', async socket => {
    await db('online_users')
      .del()
      .whereNotIn('socket_id', Object.keys(io.sockets.sockets))

    socket.on('join', async data => {
      const online_user = await db('online_users').insert({
        user_id: data.user_id,
        socket_id: socket.id,
      })

      if (online_user) {
        const notifications = await db('notifications').where({
          read: false,
          user_id: data.user_id,
        })
        if (notifications.length) {
          io.to(socket.id).emit('join', notifications)
        }
      }
    })

    socket.on('disconnect', async () => {
      await db('online_users')
        .del()
        .where({ socket_id: socket.id })
    })

    socket.on('comments', msg => {
      if (msg.action === 'create') {
        //! double check msg object has created_at key
        socket.broadcast.emit('comments', msg)
      }
      // if (msg.action === 'destroy') {
      //   db('comments')
      //     .where('id', msg.comment_id)
      //     .del()
      //     .returning('*')
      //     .then(res => {
      //       res[0]['action'] = msg.action
      //       socket.emit('comments', res[0])
      //       socket.broadcast.emit('comments', res[0])
      //     })
      // }
    })
    // ================================= REMEMBER TO FIX NOTIFICATIONS ========================
    socket.on('like', data => {
      if (data.action === 'unlike') {
        socket.broadcast.emit('like', data)
      } else {
        socket.broadcast.emit('like', data)
      }
    })
    socket.on('pony', data => {
      if (data.action === 'pony_down') {
        socket.broadcast.emit('pony', data)
      } else {
        socket.broadcast.emit('pony', data)
      }
    })
  })
}
