const session = require('koa-session');
const sessionStore = require('../libs/sessionStore');

exports.init = app => app.use(session({
  signed: false,
  store: sessionStore
}, app));
