// Typical middleware examples

const Koa = require('koa');
const fs = require('fs').promises;
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('--> middleware chain has been started', ctx.url);

  let time = new Date();

  await next();

  time = new Date() - time;

  console.log('<-- middleware chain has been ended', time, 'ms');
});

// 2. Add goodies to ctx (or ctx.request/response, but not req/res)
app.use(async (ctx, next) => {
  console.log('--> add useful method to ctx');

  ctx.renderFile = async function (file) {
    return await fs.readFile(file, 'utf-8');
  };

  // ctx.renderFile = fs.promises.readFile;

  await next();
});

// 3. Do the work, assign ctx.body (or throw)
app.use(async (ctx, next) => {
  console.log('--> work, work!');

  if (ctx.url !== '/') {
    ctx.throw(404);
  }

  ctx.body = await ctx.renderFile(__filename);

  console.log('<-- work complete!');
});

app.listen(3000);
