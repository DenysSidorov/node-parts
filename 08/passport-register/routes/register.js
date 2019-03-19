const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const config = require('config');
const uuid4 = require('uuid4');

exports.get = async function(ctx) {
  ctx.body = ctx.render('register.pug');
};

exports.post = async function(ctx) {

  const verifyEmailToken = uuid4();
  const email = ctx.request.body.email;

  try {
    const user = new User({
      email,
      displayName: ctx.request.body.displayName,
      verifyEmailToken: verifyEmailToken,
      verifiedEmail: false,
    });

    await user.setPassword(ctx.request.body.password);

    await user.save();
  } catch(e) {
    if (e.name === 'ValidationError') {
      let errorMessages = '';
      for(let key in e.errors) {
        errorMessages += `${key}: ${e.errors[key].message}<br>`;
      }
      ctx.flash('error', errorMessages);
      return ctx.redirect('/register');
    } else {
      throw e;
    }
  }

  await sendMail({
    template: 'verify-registration-email',
    to: email,
    subject: 'Подтверждение email',
    link: `${config.get('server.host')}:${config.get('server.port')}/confirm/${verifyEmailToken}`
  });

  ctx.body = ctx.render('registered.pug');

};
