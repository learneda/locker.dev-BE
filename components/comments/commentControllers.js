const db = require('../../dbConfig');
const io = require('../../index');
module.exports = {
  async getAllComments (req, res, next) {
    try {
      const selectAllComments = await db('comments');
      res.status(200).json(selectAllComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async insertComment (req, res, next) {
    const user_id = req.user.id
    if (user_id) {
      try {
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
                  socket.broadcast.emit('comments', msg);        
                });
            }
            // io.emit('comments', msg);
          });
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(417).json({msg: 'dont have access'});
    }
  }
}