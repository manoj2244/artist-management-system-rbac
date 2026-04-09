const { query } = require('../db/pool');

async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, first_name, last_name, email, password, role, token_version
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query(
    `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findTokenVersionById(userId) {
  const result = await query(
    `SELECT token_version FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0] ? result.rows[0].token_version : null;
}

async function createUser(data) {
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, first_name, last_name, email, role, created_at`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.phone,
      data.dob,
      data.gender,
      data.address,
      data.role
    ]
  );
  return result.rows[0];
}

async function incrementTokenVersion(userId) {
  await query(
    `UPDATE users
     SET token_version = token_version + 1, updated_at = NOW()
     WHERE id = $1`,
    [userId]
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  findTokenVersionById,
  createUser,
  incrementTokenVersion
};
