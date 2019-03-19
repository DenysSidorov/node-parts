const app = require('./app');
const config = require('config');

app.listen(config.get('server.port'), () => {
  console.log(`App is running on http://localhost:${config.get('server.port')}`);
});


/*
localhost:3000/transferMoney?to=hacker&amount=100&csrf=askdlfjaskdjfasfsdklajf
*/
