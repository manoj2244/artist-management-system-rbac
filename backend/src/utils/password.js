const crypto = require('crypto');

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

function hashPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_BYTES).toString('hex');

    crypto.scrypt(plainPassword, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(plainPassword, storedHash) {
  return new Promise((resolve, reject) => {
    const separatorIndex = storedHash.indexOf(':');
    const salt = storedHash.slice(0, separatorIndex);
    const hash = storedHash.slice(separatorIndex + 1);

    crypto.scrypt(plainPassword, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const isMatch = crypto.timingSafeEqual(
          Buffer.from(hash, 'hex'),
          derivedKey
        );
        resolve(isMatch);
      } catch {
        resolve(false);
      }
    });
  });
}

module.exports = { hashPassword, verifyPassword };
