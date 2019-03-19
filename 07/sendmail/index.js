const sendMail = require('./libs/sendMail');

(async function () {

  const transportResponse = await sendMail({
    template:     'hello',
    subject:      'Привет',
    to:           's.zelenov@javascript.info',
    name:         'Sergey'
  });

  console.log(transportResponse);

})().catch(console.error);
