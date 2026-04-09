const { query } = require('../db/pool');

async function findSongsByArtistId(artistId, limit, offset) {
  const result = await query(
    `SELECT id, artist_id, title, album_name, genre, created_at, updated_at
     FROM songs
     WHERE artist_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [artistId, limit, offset]
  );
  return result.rows;
}

async function countSongsByArtistId(artistId) {
  const result = await query(
    `SELECT COUNT(*) AS total FROM songs WHERE artist_id = $1`,
    [artistId]
  );
  return parseInt(result.rows[0].total, 10);
}

async function findSongById(songId) {
  const result = await query(
    `SELECT id, artist_id, title, album_name, genre, created_at, updated_at
     FROM songs
     WHERE id = $1`,
    [songId]
  );
  return result.rows[0] || null;
}

async function findLinkedArtistByUserId(userId) {
  const result = await query(
    `SELECT artist_id FROM artist_user_links WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] ? result.rows[0].artist_id : null;
}

async function createSong(data) {
  const result = await query(
    `INSERT INTO songs (artist_id, title, album_name, genre)
     VALUES ($1, $2, $3, $4)
     RETURNING id, artist_id, title, album_name, genre, created_at, updated_at`,
    [data.artist_id, data.title, data.album_name, data.genre]
  );
  return result.rows[0];
}

async function updateSong(songId, data) {
  const result = await query(
    `UPDATE songs
     SET title = $1,
         album_name = $2,
         genre = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, artist_id, title, album_name, genre, created_at, updated_at`,
    [data.title, data.album_name, data.genre, songId]
  );
  return result.rows[0] || null;
}

async function deleteSong(songId) {
  const result = await query(
    `DELETE FROM songs WHERE id = $1 RETURNING id`,
    [songId]
  );
  return result.rows[0] || null;
}

module.exports = {
  findSongsByArtistId,
  countSongsByArtistId,
  findSongById,
  findLinkedArtistByUserId,
  createSong,
  updateSong,
  deleteSong
};
