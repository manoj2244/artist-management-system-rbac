function parseCookies(headerValue) {
  if (!headerValue) {
    return {};
  }

  const parts = headerValue.split(';');
  const cookies = {};

  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.trim().split('=');
    if (!rawKey) {
      continue;
    }

    cookies[rawKey] = decodeURIComponent(rawValueParts.join('='));
  }

  return cookies;
}

function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];

  if (options.httpOnly) {
    segments.push('HttpOnly');
  }

  if (options.secure) {
    segments.push('Secure');
  }

  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }

  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  if (Number.isInteger(options.maxAge)) {
    segments.push(`Max-Age=${options.maxAge}`);
  }

  return segments.join('; ');
}

module.exports = { parseCookies, serializeCookie };
