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
    uri: 'mongodb://localhost/socketio'
  },
  redis: {
    uri: 'redis://127.0.0.1:6379'
  },
  server: {
    host: 'http://localhost',
    port: 3000,
  },
  providers: {
    facebook: {
      appId: '1584514044907807',
      appSecret: 'f0f14ef63e0c6b9ec549b9b15f63a808',
      passportOptions: {
        scope: ['email']
      }
    },
  },
  mailer: {
    gmail: {
      user: 'course.test.mailer',
      password: 'course-test-password2'
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        fromEmail: 'course.test.mailer@gmail.com',
        fromName:  'JavaScript.ru',
        signature: "<em>С уважением,<br>Javascript.ru</em>"
      },
    }
  },
};
