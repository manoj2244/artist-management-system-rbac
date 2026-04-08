function applyMiddlewares(middlewares, handler) {
  return async function run(req, res, ctx) {
    let index = -1;

    async function dispatch(position) {
      if (position <= index) {
        throw new Error('next() called multiple times');
      }

      index = position;
      const middleware = middlewares[position];

      if (!middleware) {
        return handler(req, res, ctx);
      }

      return middleware(req, res, ctx, () => dispatch(position + 1));
    }

    return dispatch(0);
  };
}

module.exports = { applyMiddlewares };
