const { applyMiddlewares } = require('../middleware/applyMiddlewares');
const { sendJson } = require('../utils/response');
const { query } = require('../db/pool');
const { authRoutes } = require('./auth.routes');
const { usersRoutes } = require('./users.routes');
const { artistsRoutes } = require('./artists.routes');

const routes = [
  {
    method: 'GET',
    path: '/api/health',
    middlewares: [],
    handler: async (_req, res) => {
      const dbResult = await query('SELECT NOW() AS db_time');

      sendJson(res, 200, {
        status: 'ok',
        database: 'connected',
        dbTime: dbResult.rows[0].db_time,
        timestamp: new Date().toISOString()
      });
    }
  },
  ...authRoutes,
  ...usersRoutes,
  ...artistsRoutes
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

function matchRoute(routePath, requestPath) {
  const routeSegments = routePath.split('/');
  const requestSegments = requestPath.split('/');

  if (routeSegments.length !== requestSegments.length) {
    return null;
  }

  const params = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    if (routeSegment.startsWith(':')) {
      params[routeSegment.slice(1)] = requestSegment;
    } else if (routeSegment !== requestSegment) {
      return null;
    }
  }

  return params;
}

function createRouter() {
  return async function router(req, res, ctx) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const method = (req.method || 'GET').toUpperCase();
    const path = normalizePath(url.pathname);

    ctx.url = url;
    ctx.path = path;
    ctx.query = Object.fromEntries(url.searchParams.entries());

    let matchedRoute = null;
    let matchedParams = {};

    for (const route of routes) {
      if (route.method !== method) {
        continue;
      }

      const params = matchRoute(route.path, path);

      if (params !== null) {
        matchedRoute = route;
        matchedParams = params;
        break;
      }
    }

    if (!matchedRoute) {
      sendJson(res, 404, { message: 'Route not found' });
      return;
    }

    ctx.params = matchedParams;

    const routeHandler = applyMiddlewares(matchedRoute.middlewares || [], matchedRoute.handler);
    await routeHandler(req, res, ctx);
  };
}

module.exports = { createRouter };
