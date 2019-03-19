const emitter = require('../libs/socketEmitter');

exports.post = async function(ctx, next) {

  if (ctx.session.socketIds) {
    ctx.session.socketIds.forEach(socketId => {
      emitter.to(socketId).emit('logout');
    });

    ctx.session.socketIds = [];
  }

  ctx.logout();
  ctx.redirect('/');
};
