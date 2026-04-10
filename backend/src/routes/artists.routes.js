const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const artistsController = require('../controllers/artists.controller');
const { ROLES } = require('../constants/roles');

const readAccess = [requireAuth, requireRole(ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER)];
const managerOnly = [requireAuth, requireRole(ROLES.ARTIST_MANAGER)];
const superAdminOnly = [requireAuth, requireRole(ROLES.SUPER_ADMIN)];

const artistsRoutes = [
  {
    method: 'GET',
    path: '/api/artists/dropdown',
    middlewares: superAdminOnly,
    handler: artistsController.getArtistsForDropdown
  },
  {
    method: 'GET',
    path: '/api/artists/export.csv',
    middlewares: managerOnly,
    handler: artistsController.exportArtists
  },
  {
    method: 'POST',
    path: '/api/artists/import.csv',
    middlewares: managerOnly,
    handler: artistsController.importArtists
  },
  {
    method: 'GET',
    path: '/api/artists',
    middlewares: readAccess,
    handler: artistsController.listArtists
  },
  {
    method: 'POST',
    path: '/api/artists',
    middlewares: managerOnly,
    handler: artistsController.createArtist
  },
  {
    method: 'GET',
    path: '/api/artists/:id',
    middlewares: readAccess,
    handler: artistsController.getArtist
  },
  {
    method: 'PUT',
    path: '/api/artists/:id',
    middlewares: managerOnly,
    handler: artistsController.updateArtist
  },
  {
    method: 'DELETE',
    path: '/api/artists/:id',
    middlewares: managerOnly,
    handler: artistsController.deleteArtist
  }
];

module.exports = { artistsRoutes };
