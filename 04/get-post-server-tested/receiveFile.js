const fs = require('fs');
const config = require('config');
const LimitSizeStream = require('./LimitSizeStream');

module.exports = function receiveFile(filepath, req, res) {
  if (req.headers['content-length'] > config.get('limitFileSize')) {
    res.statusCode = 413;
    res.end('File is too big!');
    return;
  }

  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
  const limitStream = new LimitSizeStream({limit: config.get('limitFileSize')});

  req
    .pipe(limitStream)
    .pipe(writeStream);

  limitStream.on('error', err => {
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.setHeader('Connection', 'close');
      res.end('File is too big');

      fs.unlink(filepath, err => {});
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
  });

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
