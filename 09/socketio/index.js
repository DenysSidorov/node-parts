const app = require('./app');
const config = require('config');
const socket = require('./libs/socket');
const logger = require('./libs/logger');

const server = app.listen(config.get('server.port'), () => {
  logger.info(`App is running on http://localhost:${config.get('server.port')}`);
});

socket(server);
