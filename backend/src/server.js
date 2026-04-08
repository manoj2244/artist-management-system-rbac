const http = require('http');
const { app } = require('./app');
const { env } = require('./config/env');
const { pool } = require('./db/pool');

const server = http.createServer((req, res) => {
  app(req, res);
});

server.listen(env.PORT, () => {
  console.log(`Backend server running on http://localhost:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
