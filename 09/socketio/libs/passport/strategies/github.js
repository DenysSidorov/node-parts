const GithubStrategy = require('passport-github').Strategy;
const config = require('config');
const authenticate = require('./authenticate');

module.exports = new GithubStrategy({
    clientID: config.get('providers.github.appId'),
    clientSecret: config.get('providers.github.appSecret'),
    callbackURL: config.get('providers.github.callbackURI'),
    scope: ['user:email'],
  }, function(accessToken, refreshToken, profile, done) {
    authenticate('github', profile.emails[0].value, profile, done);
  }
);
