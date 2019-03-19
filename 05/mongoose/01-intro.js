// Connecting w/ mongoose, schema, model, basic queries
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test');

const userSchema = new mongoose.Schema({
  email: {
    // index: true,
    type:       String,
    // встроенные сообщения об ошибках (можно изменить):
    // http://mongoosejs.com/docs/api.html#error_messages_MongooseError.messages
    required:   'Укажите email', // true for default message
    unique:     true,
    // index: true,
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      message: 'Укажите, пожалуйста, корректный email.'
    }],
    lowercase:  true, // to compare with another email
    trim:       true
  },
  displayName: String,
  gender: {
    type:       String,
    enum:       ['М', 'Ж'], // enum validator
    default:    'Ж'
  }
}, {
  timestamps: true // createdAt, updatedAt
});

// userSchema.index({ email });

const User = mongoose.model('User', userSchema); // users

const mary = new User({
  email: 'mary@mail.com'
});

User.remove() // mary.remove()
  .then(() => {
    return mary.save();
  })
  .then((user) => {
    console.log(user);

    return User.findOne({
      email: 'mary@mail.com'
    });
  })
  .then(user => {
    console.log(user);
  })
  .catch(console.error)
  .finally(() => {
    mongoose.disconnect();
  });
