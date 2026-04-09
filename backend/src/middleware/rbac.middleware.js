const { AppError } = require('../utils/errors');

function requireRole(...allowedRoles) {
  return async function roleGuard(req, res, ctx, next) {
    if (!ctx.user) {
      throw new AppError(401, 'Authentication required');
    }

    if (!allowedRoles.includes(ctx.user.role)) {
      throw new AppError(403, 'Access denied');
    }

    return next();
  };
}

module.exports = { requireRole };
