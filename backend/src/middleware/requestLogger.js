async function requestLogger(req, res, ctx, next) {
  const startedAt = Date.now();

  try {
    await next();
  } finally {
    const durationMs = Date.now() - startedAt;
    const method = req.method || 'GET';
    const path = ctx.path || req.url || '/';
    console.log(`${method} ${path} ${res.statusCode || 200} ${durationMs}ms`);
  }
}

module.exports = { requestLogger };
