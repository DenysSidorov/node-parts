const fs = require('fs');
const mime = require('mime');

module.exports = function sendFile(filepath, res) {
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);

  fileStream
    .on('open', () => {
      res.setHeader('Content-Type', mime.getType(filepath));
    })
    .on('error', err => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      console.error(err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal error');
      } else {
        res.end();
      }
    });

  res
    .on('close', () => {
      fileStream.destroy();
    });
};
