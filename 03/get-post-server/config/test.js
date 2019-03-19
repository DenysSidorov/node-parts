const path = require('path');

module.exports = {
  filesRoot: path.join(process.cwd(), 'test', 'files'),
  fixturesRoot: path.join(process.cwd(), 'test', 'fixtures'),
  limitFileSize: 1e6
};
