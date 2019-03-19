const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },
  mongodb: {
    debug: true,
    uri: 'mongodb://localhost/passport_facebook'
  },
  server: {
    site: {
      host: 'http://localhost',
      port: 3000,
    }
  },
  providers: {
    facebook: {
      appId: '1584514044907807',
      appSecret: 'f0f14ef63e0c6b9ec549b9b15f63a808',
      passportOptions: {
        scope: ['email']
      }
    },
    vk: {
      appId: '6726168',
      appSecret: 'vVazHGOUn1NKwTudZbT4',
      passportOptions: {
        scope: ['email']
      }
    }
  },
};
