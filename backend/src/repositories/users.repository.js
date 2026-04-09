const { query } = require('../db/pool');

async function findAllUsers(limit, offset) {
  const result = await query(
    `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

async function countAllUsers() {
  const result = await query(`SELECT COUNT(*) AS total FROM users`);
  return parseInt(result.rows[0].total, 10);
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

async function findUserByEmail(email) {
  const result = await query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function createUser(data) {
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at`,
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

async function updateUser(id, data) {
  const result = await query(
    `UPDATE users
     SET first_name = $1,
         last_name = $2,
         email = $3,
         phone = $4,
         dob = $5,
         gender = $6,
         address = $7,
         role = $8,
         updated_at = NOW()
     WHERE id = $9
     RETURNING id, first_name, last_name, email, phone, dob, gender, address, role, created_at, updated_at`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.dob,
      data.gender,
      data.address,
      data.role,
      id
    ]
  );
  return result.rows[0] || null;
}

async function deleteUser(id) {
  const result = await query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = {
  findAllUsers,
  countAllUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
