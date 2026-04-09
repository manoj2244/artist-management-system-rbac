function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidDate(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
}

function isValidGender(value) {
  return value === 'm' || value === 'f' || value === 'o';
}

function isValidRole(value) {
  return value === 'super_admin' || value === 'artist_manager' || value === 'artist';
}

module.exports = { isNonEmptyString, isValidEmail, isValidDate, isValidGender, isValidRole };
