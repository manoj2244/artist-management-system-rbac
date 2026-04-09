const { requireAuth } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const authRoutes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    middlewares: [],
    handler: authController.register
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    middlewares: [],
    handler: authController.login
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    middlewares: [requireAuth],
    handler: authController.logout
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    middlewares: [requireAuth],
    handler: authController.me
  }
];

module.exports = { authRoutes };
