require('dotenv').config();
const server = require('express')();
require('./config/passport');
require('./middleware/index')(server);
require('./components')(server);
const db = require('./dbConfig');

const port = process.env.PORT || 8000;


const myServer = server.listen(port, () => {
  console.log(`\n ==== API RUNNING === ${port}\n`);
});

server.get('/', (req, res) => {
  res.send('localhost up & alive');
});

const io = require('socket.io')(myServer)

io.on('connection', (socket) => {
  socket.on('comments', (msg) => {
    console.log('response',msg);
    if (msg.action === 'create') {
      db('comments')
        .insert({
          content:msg.content,
          user_id: msg.user_id,
          post_id: msg.post_id
        }).returning('*')
        .then((res) => {
          res[0]['username'] = msg.username;
          res[0]['action'] = msg.action;
          console.log(res[0], 'response after inserting')
          socket.broadcast.emit('comments', res[0]);
          socket.emit('comments', res[0]);        
        });
    } 
    if (msg.action === 'destroy') {
      console.log('inside destroy')
      db('comments').where('id', msg.comment_id).del().returning('*').then((res) => {
        console.log(res,'after del()')
        res[0]['action'] = msg.action;
        console.log(res[0], 'response after inserting')
        socket.emit('comments', res[0]);
        socket.broadcast.emit('comments', res[0]);
      });
    }
  });

  socket.on('like', (data) => {
    if (data.action === 'unlike') {
      db('posts_likes').del().where({user_id: data.user_id, post_id: data.post_id}).then((res) => {
        socket.broadcast.emit('like', data)
        socket.emit('like', data)
      })
    } else {
      db('posts_likes').insert({user_id: data.user_id, post_id: data.post_id}).then((res) => {
        socket.broadcast.emit('like', data)
        socket.emit('like', data)
      })
    }
  })
});
