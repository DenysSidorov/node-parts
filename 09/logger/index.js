// hi.js
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'myapp'});
log.info('hi');
log.warn({lang: 'fr'}, 'au revoir');
log.error('error!');

// var winston = require('winston');
//
// winston.log('info', 'Hello distributed log files!');
// winston.info('Hello again distributed logs');
// winston.level = 'debug';
// winston.log('debug', 'Now my debug messages are written to console!');


// stdout|stderr

module.exports = log;
