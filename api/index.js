const http = require('http');
require('dotenv').config();

const app = require('./app');
const { PORT } = require('./utils/config');
const { setupSocketServer } = require('./socket-io');

const server = http.createServer(app);

const port = PORT || 5001;

server.listen(port);
setupSocketServer(server);
