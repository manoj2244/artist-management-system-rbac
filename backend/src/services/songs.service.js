const { AppError } = require('../utils/errors');
const { ROLES } = require('../constants/roles');
const artistsRepository = require('../repositories/artists.repository');
const songsRepository = require('../repositories/songs.repository');

async function assertArtistExists(artistId) {
  const artist = await artistsRepository.findArtistById(artistId);
  if (!artist) {
    throw new AppError(404, 'Artist not found');
  }
}

async function assertOwnership(userId, artistId) {
  const linkedArtistId = await songsRepository.findLinkedArtistByUserId(userId);
  if (linkedArtistId === null) {
    throw new AppError(403, 'Your account is not linked to any artist profile');
  }
  if (String(linkedArtistId) !== String(artistId)) {
    throw new AppError(403, 'You can only manage songs for your own artist profile');
  }
}

async function listSongs(artistId, userRole, userId, page, limit, offset) {
  await assertArtistExists(artistId);

  if (userRole === ROLES.ARTIST) {
    await assertOwnership(userId, artistId);
  }

  const [songs, total] = await Promise.all([
    songsRepository.findSongsByArtistId(artistId, limit, offset),
    songsRepository.countSongsByArtistId(artistId)
  ]);

  return { songs, total, page, limit };
}

async function createSong(artistId, data, userId) {
  await assertArtistExists(artistId);
  await assertOwnership(userId, artistId);

  const song = await songsRepository.createSong({
    artist_id: artistId,
    title: data.title,
    album_name: data.album_name,
    genre: data.genre
  });

  return song;
}

async function updateSong(artistId, songId, data, userId) {
  await assertArtistExists(artistId);
  await assertOwnership(userId, artistId);

  const existingSong = await songsRepository.findSongById(songId);
  if (!existingSong) {
    throw new AppError(404, 'Song not found');
  }

  if (String(existingSong.artist_id) !== String(artistId)) {
    throw new AppError(404, 'Song not found for this artist');
  }

  const updatedSong = await songsRepository.updateSong(songId, {
    title: data.title,
    album_name: data.album_name,
    genre: data.genre
  });

  return updatedSong;
}

async function deleteSong(artistId, songId, userId) {
  await assertArtistExists(artistId);
  await assertOwnership(userId, artistId);

  const existingSong = await songsRepository.findSongById(songId);
  if (!existingSong) {
    throw new AppError(404, 'Song not found');
  }

  if (String(existingSong.artist_id) !== String(artistId)) {
    throw new AppError(404, 'Song not found for this artist');
  }

  await songsRepository.deleteSong(songId);
}

module.exports = { listSongs, createSong, updateSong, deleteSong };
