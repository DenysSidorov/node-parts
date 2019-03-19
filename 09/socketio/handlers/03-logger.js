
// request/response logger
const logger = require('../libs/logger');

exports.init = app => app.use((ctx, next) => {
  logger.info(`${ctx.method} ${ctx.url}`, {requestId: ctx.requestId});

  return next();
});
