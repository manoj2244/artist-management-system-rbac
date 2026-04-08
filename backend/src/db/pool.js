const { Pool } = require('pg');
const { env } = require('../config/env');

const pool = new Pool({
  connectionString: env.DATABASE_URL || undefined
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

function query(text, params = []) {
  return pool.query(text, params);
}

module.exports = { pool, query };
