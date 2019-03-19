const logger = require('../libs/logger');

exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      ctx.flash('error', e.message);
      ctx.redirect('/');
    } else if (e.name === 'ValidationError') {
      for (let field in e.errors) {
        ctx.flash('error', `${field}: ${e.errors[field].message}`);
      }
      ctx.redirect('/');
    } else {
      ctx.flash('error', 'Internal server error');
      ctx.redirect('/');
      logger.error(e.message, {requestId: ctx.requestId});
    }

  }
});
