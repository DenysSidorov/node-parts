const fs = require('fs');
const config = require('config');

module.exports = function receiveFile(filepath, req, res) {
  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

  req
    .pipe(writeStream);

  // req.on('end')
  // writeStream.on('finish')
  // writeStream.on('close')
  writeStream
    .on('error', err => {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File exists');
        return;
      }

      console.error(err);

      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Connection', 'close');
        res.end('Internal server error');
      } else {
        res.end();
      }

      fs.unlink(filepath, err => {});
    })
    .on('close', () => {
      res.statusCode = 201;
      res.end('File created');
    });


  req.on('close', () => {
    if (res.finished) return;

    fs.unlink(filepath, err => {});
  });

}
