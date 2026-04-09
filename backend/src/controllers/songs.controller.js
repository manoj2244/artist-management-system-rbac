const { parseJsonBody } = require('../utils/bodyParser');
const { sendJson, sendNoContent } = require('../utils/response');
const { AppError } = require('../utils/errors');
const { parsePagination } = require('../utils/pagination');
const { isNonEmptyString, isValidGenre } = require('../utils/validators');
const songsService = require('../services/songs.service');

function validateSongPayload(body) {
  const errors = {};

  if (!isNonEmptyString(body.title)) errors.title = 'Required';
  if (!isNonEmptyString(body.album_name)) errors.album_name = 'Required';
  if (!isValidGenre(body.genre)) errors.genre = 'Must be one of: rnb, country, classic, rock, jazz';

  return Object.keys(errors).length > 0 ? errors : null;
}

function parseArtistId(ctx) {
  const id = parseInt(ctx.params.artistId, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid artist id');
  }
  return id;
}

function parseSongId(ctx) {
  const id = parseInt(ctx.params.songId, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid song id');
  }
  return id;
}

async function listSongs(req, res, ctx) {
  const artistId = parseArtistId(ctx);
  const { page, limit, offset } = parsePagination(ctx.query);

  const result = await songsService.listSongs(artistId, ctx.user.role, ctx.user.id, page, limit, offset);

  sendJson(res, 200, result);
}

async function createSong(req, res, ctx) {
  const artistId = parseArtistId(ctx);
  const body = await parseJsonBody(req);
  const validationErrors = validateSongPayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const song = await songsService.createSong(artistId, body, ctx.user.id);

  sendJson(res, 201, { song });
}

async function updateSong(req, res, ctx) {
  const artistId = parseArtistId(ctx);
  const songId = parseSongId(ctx);
  const body = await parseJsonBody(req);
  const validationErrors = validateSongPayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const song = await songsService.updateSong(artistId, songId, body, ctx.user.id);

  sendJson(res, 200, { song });
}

async function deleteSong(req, res, ctx) {
  const artistId = parseArtistId(ctx);
  const songId = parseSongId(ctx);

  await songsService.deleteSong(artistId, songId, ctx.user.id);

  sendNoContent(res);
}

module.exports = { listSongs, createSong, updateSong, deleteSong };
