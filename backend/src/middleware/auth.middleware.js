const { parseCookies } = require('../utils/cookies');
const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');
const { findTokenVersionById } = require('../repositories/auth.repository');

const COOKIE_NAME = 'auth_token';

async function requireAuth(req, res, ctx, next) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    throw new AppError(401, 'Authentication required');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }

  const currentTokenVersion = await findTokenVersionById(payload.sub);

  if (currentTokenVersion === null) {
    throw new AppError(401, 'User not found');
  }

  if (payload.token_version !== currentTokenVersion) {
    throw new AppError(401, 'Session expired, please log in again');
  }

  ctx.user = {
    id: payload.sub,
    role: payload.role
  };

  return next();
}

module.exports = { requireAuth };
