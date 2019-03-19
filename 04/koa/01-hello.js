const Koa = require('koa');
const app = new Koa();

/**
 * Основные объекты:
 * ctx.req / ctx.res
 * ctx.request / ctx.response
 * ctx (контекст)
 *
 * Основные методы:
 * ctx.set/get
 * ctx.body=
 */

app.use(async (ctx, next) => { // context = {}

  await new Promise(res => setTimeout(res, 1000));

  // ctx.response.body = "hello"
  ctx.body = {result: "hello"};

});

app.listen(3000);
