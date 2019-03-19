const bodyParser = require('koa-bodyparser');

// ctx.request.body = {name: '', password: '', ...}

exports.init = app => app.use(bodyParser({
  jsonLimit: '56kb'
}));
