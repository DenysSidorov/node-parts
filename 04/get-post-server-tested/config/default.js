const path = require('path');

module.exports = {
  publicRoot: path.join(process.cwd(), 'public'),
  filesRoot: path.join(process.cwd(), 'files'),
  limitFileSize: 10e6
};
