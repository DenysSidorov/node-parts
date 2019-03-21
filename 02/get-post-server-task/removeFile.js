const fs = require('fs');
const path = require('path');

module.exports = function (req, res, pathname) {

  var name = pathname.slice(1);
  const dirPath = path.join(__dirname, 'files', name);

  fs.unlink(dirPath, (err) => {
    if (err && err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end("Couldn't find file");
    } else if (err) {
      res.statusCode = 500;
      res.end('Server error');
      console.log(' --- ', err);
    } else {
      res.statusCode = 200;
      res.end('File deleted');
    }
  });
}