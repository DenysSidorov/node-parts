const passport = require('koa-passport');
const User = require('../../models/User');

const localStrategy = require('./strategies/local');
const vkontakteStrategy = require('./strategies/vkontakte');
const githubStrategy = require('./strategies/github');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use(localStrategy);
passport.use(vkontakteStrategy);
passport.use(githubStrategy);

module.exports = passport;
