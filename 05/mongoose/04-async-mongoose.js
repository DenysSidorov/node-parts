const mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/test');

const User = mongoose.model('User', new mongoose.Schema({
  email:   {
    type:     String,
    required: 'укажите email',
    unique:   'такой email уже есть',
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      message: 'Укажите, пожалуйста, корректный email.'
    }]
  }
}));

async function createUsers() {

  await User.remove({});
  let john2 = await User.create({email: 'ann@gmail.com'});
  let pete = await User.create({email: 'ann@gmail.com'});
  let mary = await User.create({email: 'mary@gmail.com'});

}

// ВОПРОС: что будет при ошибке валидации?
// структура ошибки валидации: err.errors

createUsers()
  .then(() => console.log("done"))
  .catch(console.error)
  // .catch(err => {
  //   console.log(Object.keys(err.errors).map(key => ({key, msg: err.errors[key].message})))
  // })
  .finally(() => mongoose.disconnect());
