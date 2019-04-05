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
    // emit them right back to all the users listening to this connection
    if (msg.action === 'create') {
      db('comments')
        .insert({
          content:msg.content,
          user_id: msg.user_id,
          post_id: msg.post_id
        })
        .then((res) =>{
          socket.broadcast.emit('comments', {msg, username: socket.id.slice(8)})          
        });
    }
    // io.emit('comments', msg);
  });
});