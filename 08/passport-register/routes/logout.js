exports.post = async function(ctx, next) {
  ctx.logout();

  ctx.redirect('/');
};
