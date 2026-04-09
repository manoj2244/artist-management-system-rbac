const crypto = require('crypto');
const { env } = require('../config/env');

function base64urlEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlDecode(str) {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function parseExpiryToSeconds(value) {
  const units = { s: 1, m: 60, h: 3600, d: 86400 };
  const match = String(value).match(/^(\d+)([smhd])$/);
  if (!match) {
    return 900;
  }
  return parseInt(match[1], 10) * units[match[2]];
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expiresInSeconds = parseExpiryToSeconds(env.JWT_EXPIRES_IN);

  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const headerEncoded = base64urlEncode(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64urlEncode(Buffer.from(JSON.stringify(claims)));
  const signingInput = `${headerEncoded}.${payloadEncoded}`;

  const signature = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64urlEncode(signature)}`;
}

function verifyToken(token) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const signingInput = `${headerEncoded}.${payloadEncoded}`;

  const expectedSignature = base64urlEncode(
    crypto
      .createHmac('sha256', env.JWT_SECRET)
      .update(signingInput)
      .digest()
  );

  if (signatureEncoded !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(base64urlDecode(payloadEncoded).toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}

module.exports = { signToken, verifyToken };
