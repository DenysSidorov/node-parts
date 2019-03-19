
exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      ctx.body = e.message;
      ctx.status = e.status;
    } else if (e.name == "ValidationError") {

      ctx.status = 400;

      let errors = {};

      for (let field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      ctx.body = {
        errors: errors
      };

    } else {
      ctx.body = 'Error 500';
      ctx.status = 500;
      console.error(e.message, e.stack);
    }

  }
});
