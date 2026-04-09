const { parseJsonBody } = require('../utils/bodyParser');
const { sendJson, sendNoContent } = require('../utils/response');
const { AppError } = require('../utils/errors');
const { parsePagination } = require('../utils/pagination');
const {
  isNonEmptyString,
  isValidEmail,
  isPastDate,
  isValidPhone,
  isValidGender,
  isValidRole
} = require('../utils/validators');
const usersService = require('../services/users.service');

function validateUserPayload(body) {
  const errors = {};

  if (!isNonEmptyString(body.first_name)) errors.first_name = 'Required';
  if (!isNonEmptyString(body.last_name)) errors.last_name = 'Required';
  if (!isValidEmail(body.email)) errors.email = 'Valid email required';
  if (!isValidPhone(body.phone)) errors.phone = 'Valid phone number required';
  if (!isPastDate(body.dob)) errors.dob = 'Valid past date required (YYYY-MM-DD)';
  if (!isValidGender(body.gender)) errors.gender = 'Must be m, f, or o';
  if (!isNonEmptyString(body.address)) errors.address = 'Required';
  if (!isValidRole(body.role)) errors.role = 'Must be super_admin, artist_manager, or artist';

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateCreatePayload(body) {
  const errors = validateUserPayload(body) || {};

  if (!isNonEmptyString(body.password) || body.password.length < 8) {
    errors.password = 'Minimum 8 characters required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

async function listUsers(req, res, ctx) {
  const { page, limit, offset } = parsePagination(ctx.query);
  const result = await usersService.listUsers(page, limit, offset);

  sendJson(res, 200, result);
}

async function getUser(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid user id');
  }

  const user = await usersService.getUserById(id);

  sendJson(res, 200, { user });
}

async function createUser(req, res, ctx) {
  const body = await parseJsonBody(req);
  const validationErrors = validateCreatePayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const user = await usersService.createUser(body);

  sendJson(res, 201, { user });
}

async function updateUser(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid user id');
  }

  const body = await parseJsonBody(req);
  const validationErrors = validateUserPayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const user = await usersService.updateUser(id, body);

  sendJson(res, 200, { user });
}

async function deleteUser(req, res, ctx) {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'Invalid user id');
  }

  if (parseInt(ctx.user.id, 10) === id) {
    throw new AppError(400, 'You cannot delete your own account');
  }

  await usersService.deleteUser(id);

  sendNoContent(res);
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
