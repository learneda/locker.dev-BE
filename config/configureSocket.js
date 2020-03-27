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
        msg['created_at'] = Date.now()
        socket.broadcast.emit('comments', msg)
        socket.emit('comments', msg)

        // db('comments')
        //   .insert({
        //     content: msg.content,
        //     user_id: msg.user_id,
        //     post_id: msg.post_id,
        //   })
        //   .returning('*')
        //   .then(res => {
        //     res[0]['username'] = msg.username
        //     res[0]['action'] = msg.action
        //     socket.broadcast.emit('comments', res[0])
        //     socket.emit('comments', res[0])

        //     if (msg.user_id != msg.postOwnerId) {
        //       db('notifications')
        //         .insert({
        //           user_id: msg.postOwnerId,
        //           post_id: msg.post_id,
        //           type: 'comment',
        //           invoker: msg.username,
        //         })
        //         .returning('*')
        //         .then(() => db('online_users').where({ user_id: msg.postOwnerId }))
        //         .then(online_data => {
        //           if (online_data.length) {
        //             db('notifications')
        //               .where({ read: false, user_id: online_data[0].user_id })
        //               .then(notificationRes => {
        //                 if (notificationRes.length) {
        //                   io.to(online_data[0].socket_id).emit('join', notificationRes[notificationRes.length - 1])
        //                 }
        //               })
        //           }
        //         })
        //     }
        //   })
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
        db('posts_likes')
          .del()
          .where({ user_id: data.user_id, post_id: data.id })
          .then(() => {
            socket.broadcast.emit('like', data)
            socket.emit('like', data)
          })
      } else {
        db('posts_likes')
          .insert({ user_id: data.user_id, post_id: data.id })
          .then(() => {
            socket.broadcast.emit('like', data)
            socket.emit('like', data)
          })
        if (data.user_id !== data.postOwnerId) {
          db('notifications')
            .insert({
              user_id: data.postOwnerId,
              post_id: data.id,
              type: 'like',
              invoker: data.username,
            })
            .then(() => db('online_users').where({ user_id: data.postOwnerId }))
            .then(online_data => {
              if (online_data.length) {
                db('notifications')
                  .where({ read: false, user_id: online_data[0].user_id })
                  .then(notificationRes => {
                    if (notificationRes.length) {
                      io.to(online_data[0].socket_id).emit('join', notificationRes)
                    }
                  })
              }
            })
        }
      }
    })
    socket.on('pony', data => {
      if (data.action === 'pony_down') {
        db('posts_ponies')
          .del()
          .where({ user_id: data.user_id, post_id: data.id })
          .then(() => {
            socket.broadcast.emit('pony', data)
            socket.emit('pony', data)
          })
      } else {
        db('posts_ponies')
          .insert({ user_id: data.user_id, post_id: data.id })
          .then(() => {
            socket.broadcast.emit('pony', data)
            socket.emit('pony', data)
          })
        if (data.user_id !== data.postOwnerId) {
          db('notifications')
            .insert({
              user_id: data.postOwnerId,
              post_id: data.id,
              type: 'pony',
              invoker: data.username,
            })
            .then(() => db('online_users').where({ user_id: data.postOwnerId }))
            .then(online_data => {
              if (online_data.length) {
                db('notifications')
                  .where({ read: false, user_id: online_data[0].user_id })
                  .then(notificationRes => {
                    if (notificationRes.length) {
                      io.to(online_data[0].socket_id).emit('join', notificationRes)
                    }
                  })
              }
            })
        }
      }
    })
  })
}
