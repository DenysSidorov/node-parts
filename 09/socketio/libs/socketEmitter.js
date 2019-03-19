const redis = require('redis');
const socketEmitter = require('socket.io-emitter');
const config = require('config');

const redisClient = redis.createClient(config.get('redis.uri'));

module.exports = socketEmitter(redisClient);
