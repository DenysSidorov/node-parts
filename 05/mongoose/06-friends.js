const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test');

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: 'Укажите email', // true for default message
    unique:   true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const User = mongoose.model('User', userSchema);

(async function () {

  await User.remove({});

  let pete = await User.create({email: 'pete@gmail.com'});
  let john = await User.create({email: 'john@gmail.com'});
  let ann = await User.create({email: 'ann@gmail.com'});

  pete.friends = [john, ann];

  // console.log(pete);

  await pete.save();

  pete = await User.findOne({
    email: 'pete@gmail.com'
  }).populate('friends');

  console.log(pete);

  // deep (multi-level) populate: http://mongoosejs.com/docs/populate.html#deep-populate

})().catch(console.error).then(() => mongoose.disconnect());
