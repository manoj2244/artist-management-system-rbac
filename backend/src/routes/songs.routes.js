const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const songsController = require('../controllers/songs.controller');
const { ROLES } = require('../constants/roles');

const allRoles = [requireAuth, requireRole(ROLES.SUPER_ADMIN, ROLES.ARTIST_MANAGER, ROLES.ARTIST)];
const artistOnly = [requireAuth, requireRole(ROLES.ARTIST)];

const songsRoutes = [
  {
    method: 'GET',
    path: '/api/artists/:artistId/songs',
    middlewares: allRoles,
    handler: songsController.listSongs
  },
  {
    method: 'POST',
    path: '/api/artists/:artistId/songs',
    middlewares: artistOnly,
    handler: songsController.createSong
  },
  {
    method: 'PUT',
    path: '/api/artists/:artistId/songs/:songId',
    middlewares: artistOnly,
    handler: songsController.updateSong
  },
  {
    method: 'DELETE',
    path: '/api/artists/:artistId/songs/:songId',
    middlewares: artistOnly,
    handler: songsController.deleteSong
  }
];

module.exports = { songsRoutes };
