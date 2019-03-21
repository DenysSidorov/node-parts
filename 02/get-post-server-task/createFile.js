const fs = require('fs');
const path = require('path');

module.exports = function (req, res, pathname) {

  var name = pathname.slice(1);
  const dirPath = path.join(__dirname, 'files', name);

  var writeStream = fs.createWriteStream(dirPath, {flags: 'wx'});
  req.pipe(writeStream);

  writeStream.on('error', function (error) {
      if(error.code === 'EEXIST'){
        res.statusCode = 409;
        res.end('File already exists');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    })

    .on('finish', function () {
      res.statusCode = 200;
      res.end('File added');
    });

}
