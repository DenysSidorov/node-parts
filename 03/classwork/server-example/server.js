const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = decodeURI(url.parse(req.url).pathname);
  const filename = pathname.slice(1);

  switch(req.method) {
  case 'GET':
    const filePath = (pathname === '/')
      ? path.join('public', 'index.html')
      : path.join('files', filename);

    fs.exists(filePath, exists => {
      if (exists) {
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', err => {
          console.log(err);
          res.statusCode = 500;
          res.end('Internal server error');
        })
        fileStream.pipe(res);
      } else {
        res.statusCode = 404;
        res.end('not found');
      }
    });

    break;

  case 'DELETE':
    if (!filename) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    fs.unlink(path.join('files', filename), err => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        console.error(err);
        res.statusCode = 500;
        res.end('Internal error');
      } else {
        res.statusCode = 200;
        res.end('Ok');
      }
    });
    break;
  default:
    res.statusCode = 501;
    res.end('Not implemented');
  }

});

module.exports = server;
