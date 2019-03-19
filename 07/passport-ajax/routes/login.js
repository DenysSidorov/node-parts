const passport = require('../libs/passport');

exports.post = async (ctx, next) => {
  await passport.authenticate('local', async function(err, user, info) {
    if (err) throw err;

    if (user) {
      await ctx.login(user);
      ctx.body = {displayName: user.displayName, email: user.email};
    } else {
      ctx.status = 401;
      ctx.body = info;
    }
  })(ctx, next);
};
