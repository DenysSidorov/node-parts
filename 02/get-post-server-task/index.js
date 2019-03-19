const url = require('url');
const fs = require('fs');
const path = require('path');
const http = require('http');

const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = decodeURI(url.parse(req.url).pathname);

  switch(req.method) {
  case 'GET':
    if (pathname == '/') {
      const filePath = path.join(__dirname, 'public', 'index.html');
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }

    break;

  default:
    res.statusCode = 501;
    res.end('Not implemented');
  }

});

server.listen(3000);
