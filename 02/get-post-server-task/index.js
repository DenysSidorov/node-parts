const url = require('url');
const fs = require('fs');
const path = require('path');
const http = require('http');
const sendFile = require('./sendFile');
const createFile = require('./createFile');
const removeFile = require('./removeFile');

const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = decodeURI(url.parse(req.url).pathname);
  console.log('pathname - ', pathname);
  switch (req.method) {
    case 'GET':
      if (pathname == '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        sendFile(req, res, pathname);
      }
      break;
    case 'POST':
      createFile(req, res, pathname);
      break;

    case 'DELETE':
      removeFile(req, res, pathname);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

});

server.listen(3000);
