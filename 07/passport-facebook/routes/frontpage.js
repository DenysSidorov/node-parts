exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) { // return !!ctx.state.user;
    ctx.body = ctx.render('welcome.pug');
  } else {
    ctx.body = ctx.render('login.pug');
  }
};
