const pug = require('pug');
const path = require('path');
const config = require('config');

exports.init = app => app.use(async (ctx, next) => {
  /* default helpers */
  ctx.locals = {
    /* at the time of ctx middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.state.user; // passport sets ctx
    },

    get flash() {
      return ctx.getFlashMessages();
    }
  };

  ctx.render = function(templatePath, locals) {
    return pug.renderFile(
      path.join(config.get('templatesRoot'), templatePath),
      Object.assign({}, ctx.locals, locals)
    );
  };

  await next();
});
