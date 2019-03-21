const fs = require('fs');
const path = require('path');

module.exports = function (req, res, pathname) {
  if(countSlashInPath(pathname) > 1){
    res.statusCode = 400;
    res.end("Server doesn't allow nested path");
  } else {
    var name = pathname.slice(1);
    const filePath = path.join(__dirname, 'files', name);
    const readFile = fs.createReadStream(filePath);
    res.statusCode = 200;
    readFile.pipe(res);

    readFile.on('error', function (error) {
      if(error.code === 'ENOENT'){
        res.statusCode = 404;
        res.end('Not found');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    })
  }
}

function countSlashInPath(path) {
  var count = 0;
  path.split('').forEach((el) => el === '/' ? count++ : '' );
  return count;
}