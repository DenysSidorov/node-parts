import http from 'http';

const server = new http.Server();
import handler from './handler';

/*
1. core_modules/handler
2. ./node_modules/handler
   ../node_modules/handler
   ../../node_modules/handler
3. NODE_PATH=. node server.js
   set NODE_PATH=. && node server.js
*/

server.on('request', handler);

const emit = server.emit;
server.emit = (...args) => {
  console.log(args[0]);
  return emit.apply(server, args);
};

server.listen(8000);
