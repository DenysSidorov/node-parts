const Cookies = require('cookies');
const config = require('config');
const User = require('../models/User');

const socketIO = require('socket.io');
const socketRedis = require('socket.io-redis');
const sessionStore = require('./sessionStore');

function socket(server) {
  const io = socketIO(server);
  // publish/subscribe
  io.adapter(socketRedis(config.get('redis.uri')));

  io.use(async function(socket, next) {
    const cookies = new Cookies(socket.request, {});
    const sid = cookies.get('koa:sess');

    if (!sid) {
      return next(new Error('Missing auth cookie'));
    }

    const session = await sessionStore.get(sid);

    if (!session) {
      return next(new Error("No session"));
    }

    if (!session.passport && !session.passport.user) {
      return next(new Error("Anonymous session not allowed"));
    }

    socket.user = await User.findById(session.passport.user);

    session.socketIds = session.socketIds
        ? session.socketIds.concat(socket.id)
        : [socket.id];

    await sessionStore.set(sid, session, null, {rolling: true});

    socket.on('disconnect', async function() {
      try {
        const session = await sessionStore.get(sid);
        if (session) {
          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
          await sessionStore.set(sid, session, null, {rolling: true});
        }
      } catch {}
    });

    next();
  });

  io.on('connection', function (socket) {
    socket.broadcast.emit('message', `${socket.user.displayName} connected.`);
    // io.emit()
    socket.emit('message', 'hello', (response) => {
      console.log("delivered", response);
    });

    socket.on('test', (txt, cb) => {
      console.log(txt);
      cb('from server');
    });

    socket.on('message', msg => {
      socket.broadcast.emit('message', {
        user: socket.user.displayName,
        msg
      });
    });
  });
}

module.exports = socket;
