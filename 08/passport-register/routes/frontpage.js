exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('welcome.pug');
  } else {
    ctx.body = ctx.render('login.pug');
  }
};
