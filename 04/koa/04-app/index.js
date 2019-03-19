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

router.get('/views', async (ctx, next) => {
  let count = ctx.session.count || 0;
  ctx.session.count = ++count;

  ctx.body = ctx.render('index.pug', {
    user: 'John',
    count: count
  });
});


// параметр ctx.params
// см. различные варианты https://github.com/pillarjs/path-to-regexp
//   - по умолчанию 1 элемент пути, можно много *
//   - по умолчанию обязателен, можно нет ?
//   - уточнение формы параметра через regexp'ы
router.get('/user/:user', (ctx, next) => {
  ctx.body = "Hello, " + ctx.params.user;
});

router.get('/', (ctx) => {
  ctx.redirect('/views');
});

app.use(router.routes());
app.listen(config.get('port'));
