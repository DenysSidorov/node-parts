const Koa = require('koa');
const app = new Koa();

const config = require('config');

require('./handlers/01-favicon').init(app);
require('./handlers/02-static').init(app);
require('./handlers/03-logger').init(app);
require('./handlers/04-templates').init(app);
require('./handlers/05-errors').init(app);
require('./handlers/06-session').init(app);
require('./handlers/07-bodyParser').init(app);

const Router = require('koa-router');
const router = new Router();

let clients = [];

// const ee = new EventEmmiter();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise(resolve => {
    clients.push(resolve);

    // ee.on('message', resolve);

    ctx.res.on('close', () => {
      clients = clients.filter(_resolve => _resolve !== resolve);
      resolve();
    });
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

  clients.forEach(resolve => {
    resolve(message);
  });

  clients = [];

  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
