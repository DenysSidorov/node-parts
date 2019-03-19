let i = 0;

exports.get = async function(ctx, next) {
  if (ctx.isAuthenticated()) { // return !!ctx.state.user;
    i++;
    if (i % 5 === 0) {
      ctx.flash('success', 'поздравляем, вы выиграли джек-пот!');
    }
    ctx.body = ctx.render('welcome.pug');
  } else {
    ctx.body = ctx.render('login.pug');
  }
};
