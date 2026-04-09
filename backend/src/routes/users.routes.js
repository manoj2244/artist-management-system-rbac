const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const usersController = require('../controllers/users.controller');
const { ROLES } = require('../constants/roles');

const superAdminOnly = [requireAuth, requireRole(ROLES.SUPER_ADMIN)];

const usersRoutes = [
  {
    method: 'GET',
    path: '/api/users',
    middlewares: superAdminOnly,
    handler: usersController.listUsers
  },
  {
    method: 'POST',
    path: '/api/users',
    middlewares: superAdminOnly,
    handler: usersController.createUser
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    middlewares: superAdminOnly,
    handler: usersController.getUser
  },
  {
    method: 'PUT',
    path: '/api/users/:id',
    middlewares: superAdminOnly,
    handler: usersController.updateUser
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    middlewares: superAdminOnly,
    handler: usersController.deleteUser
  }
];

module.exports = { usersRoutes };
