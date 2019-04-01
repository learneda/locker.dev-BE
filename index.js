require('dotenv').config();
const server = require('express')();
require('./config/passport');
require('./middleware/index')(server);
require('./components')(server);

const port = process.env.PORT || 8000;
server.get('/', (req, res) => {
  res.send('localhost up & alive');
});

server.listen(port, () => {
  console.log(`\n ==== API RUNNING === ${port}\n`);
});
