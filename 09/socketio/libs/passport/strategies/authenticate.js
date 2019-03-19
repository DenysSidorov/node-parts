const User = require('../../../models/User');

module.exports = async function authenticate(strategy, email, profile, done) {
  User.findOne({email}, (err, user) => {
    if (err) return done(err);
    
    if (!user) {
      User.create({
        email,
        displayName: profile.displayName || profile.username,
        providers: [{id: strategy, profile}]
      }, (err, user) => {
        if (err) return done(err);
        done(null, user, { message: 'Добро пожаловать!' });
      });
    } else {
      if (user.providers.find(provider => provider.id === strategy)) {
        done(null, user, { message: 'Добро пожаловать!' });
      } else {
        user.providers.push({ id: strategy, profile });
        user.save(err => {
          if (err) return done(err);
          
          done(null, user, { message: 'Добро пожаловать!' });
        });
      }
    }
  });
};