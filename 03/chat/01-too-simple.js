// слишком простой чат, в коде есть минимум 7 серьёзных ошибок - найдите их
const http = require('http');
const fs = require('fs');

let clients = [];

const server = new http.Server();

server.on('request', (req, res) => {

  switch (req.method + ' ' + req.url) {

  case 'GET /':
    // 1. нет обработчика ошибок
    // 2. нет обработки обрыва
    // a. формирование пути до файла (лучше через path.join относительно __dirname)
    fs.createReadStream('index.html').pipe(res);
    break;

  case 'GET /subscribe':
    console.log("subscribe");
    // 3. нет обработки обрыва соединения
    clients.push(res);
    break;

  case 'POST /publish':
    let body = '';

    req
      .on('data', data => {
        // 4. строка может быть разбита посреди символа
        // 5. нет проверки на размер
        body += data;
      })
      .on('end', () => {
        // 6. try/catch
        body = JSON.parse(body);

        console.log("publish '%s'", body.message);

        clients.forEach(res => {
          // 7. нет проверки на тип (приведения к строке)
          res.end(body.message);
        });

        clients = [];

        res.end("ok");
      });

    break;

  default:
    res.statusCode = 404;
    res.end("Not found");
  }

});

server.listen(3000);
