const server = require('./server');

server.listen(3000, '127.0.0.1', () => {
  console.log('Server is running on http://127.0.0.1:3000/');
});
