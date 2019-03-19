const path = require('path');

module.exports = {
  mongodb: {
    debug: false,
    uri: 'mongodb://localhost/passport_register_test'
  },
  providers: {
    facebook: {
      test: {
        login: 'course.test.facebook@gmail.com',
        password: 'course-test-facebook'
      }
    }
  }
};
