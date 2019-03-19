const passport = require('../libs/passport');

exports.post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true, // ctx.flash()
  successFlash: true
});

// exports.post = async function(ctx, next) {
//
//   // @see node_modules/koa-passport/lib/framework/koa.js for passport.authenticate
//   // it returns the middleware to delegate
//   await passport.authenticate('local', async function(err, user, info) {
//     // ...
//      ctx.body = { user };
//   })(ctx, next);
//
// };
