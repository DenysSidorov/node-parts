const passport = require('koa-passport');
const User = require('../../models/User');

const localStrategy = require('./strategies/local');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use(localStrategy);

module.exports = passport;
