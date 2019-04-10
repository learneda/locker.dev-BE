require('dotenv').config();
const server = require('express')();
require('./config/passport');
require('./middleware/index')(server);
require('./components')(server);
const db = require('./dbConfig');

const port = process.env.PORT || 8000;


server.listen(port, () => {
  console.log(`\n ==== API RUNNING === ${port}\n`);
});

server.get('/', (req, res) => {
  res.send('localhost up & alive');
});