const winston = require('winston'); // bunyan
const config = require('config');

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  level: config.get('logger.level'),
  transports: [new winston.transports.Console()]
});
