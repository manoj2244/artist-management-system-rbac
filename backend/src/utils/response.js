function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });

  res.end(body);
}

function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

module.exports = { sendJson, sendNoContent };
