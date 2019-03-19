const session = require('koa-session');

/*
const sessions = {
  [id]: {count: 4}
};
*/
// ctx.session
exports.init = app => app.use(session({
  signed: false
}, app));
