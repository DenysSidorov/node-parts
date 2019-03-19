const session = require('koa-session');

exports.init = app => app.use(session({
  signed: false
}, app));
