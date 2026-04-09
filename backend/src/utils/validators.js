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

function isPastDate(value) {
  if (!isValidDate(value)) {
    return false;
  }
  return new Date(value) < new Date();
}

function isValidPhone(value) {
  if (typeof value !== 'string') {
    return false;
  }
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isValidYear(value) {
  const year = parseInt(value, 10);
  const currentYear = new Date().getFullYear();
  return Number.isInteger(year) && year >= 1900 && year <= currentYear + 1;
}

function isNonNegativeInteger(value) {
  const num = parseInt(value, 10);
  return Number.isInteger(num) && num >= 0;
}

function isValidGender(value) {
  return value === 'm' || value === 'f' || value === 'o';
}

function isValidRole(value) {
  return value === 'super_admin' || value === 'artist_manager' || value === 'artist';
}

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidDate,
  isPastDate,
  isValidPhone,
  isValidYear,
  isNonNegativeInteger,
  isValidGender,
  isValidRole
};
