const { applyMiddlewares } = require('../middleware/applyMiddlewares');
const { sendJson } = require('../utils/response');
const { query } = require('../db/pool');

const routes = [
  {
    method: 'GET',
    path: '/api/health',
    middlewares: [],
    handler: async (req, res) => {
      const dbResult = await query('SELECT NOW() AS db_time');

      sendJson(res, 200, {
        status: 'ok',
        database: 'connected',
        dbTime: dbResult.rows[0].db_time,
        timestamp: new Date().toISOString()
      });
    }
  }
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function createRouter() {
  return async function router(req, res, ctx) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const method = (req.method || 'GET').toUpperCase();
    const path = normalizePath(url.pathname);

    ctx.url = url;
    ctx.path = path;
    ctx.query = Object.fromEntries(url.searchParams.entries());

    const matchedRoute = routes.find((route) => route.method === method && route.path === path);

    if (!matchedRoute) {
      sendJson(res, 404, {
        message: 'Route not found'
      });
      return;
    }

    const routeHandler = applyMiddlewares(matchedRoute.middlewares || [], matchedRoute.handler);
    await routeHandler(req, res, ctx);
  };
}

module.exports = { createRouter };
