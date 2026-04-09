const { query } = require('../db/pool');

async function findAllArtists(limit, offset) {
  const result = await query(
    `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at
     FROM artists
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

async function countAllArtists() {
  const result = await query(`SELECT COUNT(*) AS total FROM artists`);
  return parseInt(result.rows[0].total, 10);
}

async function findArtistById(id) {
  const result = await query(
    `SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at
     FROM artists
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findAllArtistsForExport() {
  const result = await query(
    `SELECT name, TO_CHAR(dob, 'YYYY-MM-DD') AS dob, gender, address, first_release_year, no_of_albums_released
     FROM artists
     ORDER BY created_at ASC`
  );
  return result.rows;
}

async function createArtist(data) {
  const result = await query(
    `INSERT INTO artists (name, dob, gender, address, first_release_year, no_of_albums_released)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at`,
    [
      data.name,
      data.dob,
      data.gender,
      data.address,
      data.first_release_year,
      data.no_of_albums_released
    ]
  );
  return result.rows[0];
}

async function updateArtist(id, data) {
  const result = await query(
    `UPDATE artists
     SET name = $1,
         dob = $2,
         gender = $3,
         address = $4,
         first_release_year = $5,
         no_of_albums_released = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at`,
    [
      data.name,
      data.dob,
      data.gender,
      data.address,
      data.first_release_year,
      data.no_of_albums_released,
      id
    ]
  );
  return result.rows[0] || null;
}

async function deleteArtist(id) {
  const result = await query(
    `DELETE FROM artists WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  findAllArtists,
  countAllArtists,
  findArtistById,
  findAllArtistsForExport,
  createArtist,
  updateArtist,
  deleteArtist
};
