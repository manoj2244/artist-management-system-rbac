const { parseJsonBody, parseRawBody } = require('../utils/bodyParser');
const { sendJson, sendNoContent } = require('../utils/response');
const { AppError } = require('../utils/errors');
const { parsePagination } = require('../utils/pagination');
const artistsService = require('../services/artists.service');

async function getArtistsForDropdown(_req, res) {
  const artists = await artistsService.getArtistsForDropdown();
  sendJson(res, 200, { artists });
}

async function listArtists(req, res, ctx) {
  const { page, limit, offset } = parsePagination(ctx.query);
  const result = await artistsService.listArtists(page, limit, offset);

  sendJson(res, 200, result);
}

async function getArtist(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid artist id');
  }

  const artist = await artistsService.getArtistById(id);

  sendJson(res, 200, { artist });
}

async function createArtist(req, res, ctx) {
  const body = await parseJsonBody(req);
  const artist = await artistsService.createArtist(body);

  sendJson(res, 201, { artist });
}

async function updateArtist(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid artist id');
  }

  const body = await parseJsonBody(req);
  const artist = await artistsService.updateArtist(id, body);

  sendJson(res, 200, { artist });
}

async function deleteArtist(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid artist id');
  }

  await artistsService.deleteArtist(id);

  sendNoContent(res);
}

async function exportArtists(req, res) {
  const csvContent = await artistsService.exportArtistsCSV();

  res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="artists.csv"',
    'Content-Length': Buffer.byteLength(csvContent)
  });

  res.end(csvContent);
}

async function importArtists(req, res) {
  const csvText = await parseRawBody(req);

  if (!csvText.trim()) {
    throw new AppError(400, 'Request body is empty');
  }

  const result = await artistsService.importArtistsCSV(csvText);

  sendJson(res, 200, result);
}

module.exports = {
  getArtistsForDropdown,
  listArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  exportArtists,
  importArtists
};
