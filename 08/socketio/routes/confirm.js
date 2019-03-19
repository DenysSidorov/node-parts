const User = require('../models/User');

exports.get = async function(ctx) {
  
  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken
  });
  
  if (!user) {
    ctx.throw(404, 'Ссылка подтверждения недействительна или устарела.');
  }
  
  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
  }
  
  user.verifyEmailToken = null;
  
  await user.save();
  
  await ctx.login(user);
  
  ctx.redirect('/');
};
