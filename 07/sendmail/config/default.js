const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  mailer: {
    transport: 'gmail',
    gmail: {
      user: 'course.test.mailer',
      password: 'course-test-password2'
    },
    senders:  {
      // transactional emails, register/forgot pass etc
      default:  {
        from: 'course.test.mailer@gmail.com',
        from:  'JavaScript.ru',
        signature: "<em>С уважением,<br>Course Course</em>"
      },
      /* newsletters example
      informer: {
        fromEmail: 'informer@gmail.com',
        fromName:  'Newsletters',
        signature: "<em>Have fun!</em>"
      }
      */
    }
  },
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
  root: process.cwd()
};
