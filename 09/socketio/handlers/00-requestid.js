const uuid4 = require('uuid4');

exports.init = app => app.use((ctx, next) => {
  ctx.requestId = uuid4();
  return next();
});
