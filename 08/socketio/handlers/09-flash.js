
exports.init = app => app.use(async function(ctx, next) {

  // keep previous flash
  const messages = ctx.session.messages || {};

  // clear all flash
  delete ctx.session.messages;

  ctx.getFlashMessages = function() {
    return messages;
  };

  ctx.flash = function(type, html) {
    if (!ctx.session.messages) {
      ctx.session.messages = {};
    }

    if (!ctx.session.messages[type]) {
      ctx.session.messages[type] = [];
    }

    ctx.session.messages[type].push(html);
  };

  await next();

  if (ctx.status === 302 && !ctx.session.messages) {
    // pass on the flash over a redirect
    ctx.session.messages = messages;
  }

});
