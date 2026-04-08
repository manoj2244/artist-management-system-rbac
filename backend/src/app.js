const { createRouter } = require('./routes');
const { applyMiddlewares } = require('./middleware/applyMiddlewares');
const { requestLogger } = require('./middleware/requestLogger');
const { toErrorResponse } = require('./utils/errors');
const { sendJson } = require('./utils/response');

const router = createRouter();
const handler = applyMiddlewares([requestLogger], router);

async function app(req, res) {
  const ctx = {};

  try {
    await handler(req, res, ctx);
  } catch (error) {
    const { statusCode, body } = toErrorResponse(error);
    sendJson(res, statusCode, body);
  }
}

module.exports = { app };
