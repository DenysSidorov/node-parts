const MongooseStore = require('koa-session-mongoose');
const mongoose = require('./mongoose');

module.exports = new MongooseStore({
  name: 'Session',
  expires: 3600 * 4,
  connection: mongoose
});
