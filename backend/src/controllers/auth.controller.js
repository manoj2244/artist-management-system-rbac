const { parseJsonBody } = require('../utils/bodyParser');
const { sendJson } = require('../utils/response');
const { AppError } = require('../utils/errors');
const { serializeCookie } = require('../utils/cookies');
const { env } = require('../config/env');
const {
  isNonEmptyString,
  isValidEmail,
  isPastDate,
  isValidPhone,
  isValidGender
} = require('../utils/validators');
const authService = require('../services/auth.service');

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE_SECONDS = 15 * 60;

function validateRegisterPayload(body) {
  const errors = {};

  if (!isNonEmptyString(body.first_name)) errors.first_name = 'Required';
  if (!isNonEmptyString(body.last_name)) errors.last_name = 'Required';
  if (!isValidEmail(body.email)) errors.email = 'Valid email required';
  if (!isNonEmptyString(body.password) || body.password.length < 8) {
    errors.password = 'Minimum 8 characters required';
  }
  if (!isValidPhone(body.phone)) errors.phone = 'Valid phone number required';
  if (!isPastDate(body.dob)) errors.dob = 'Valid past date required (YYYY-MM-DD)';
  if (!isValidGender(body.gender)) errors.gender = 'Must be m, f, or o';
  if (!isNonEmptyString(body.address)) errors.address = 'Required';

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateLoginPayload(body) {
  const errors = {};

  if (!isValidEmail(body.email)) errors.email = 'Valid email required';
  if (!isNonEmptyString(body.password)) errors.password = 'Required';

  return Object.keys(errors).length > 0 ? errors : null;
}

async function register(req, res) {
  const body = await parseJsonBody(req);
  const validationErrors = validateRegisterPayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const user = await authService.registerUser(body);

  sendJson(res, 201, { message: 'Registration successful', user });
}

async function login(req, res) {
  const body = await parseJsonBody(req);
  const validationErrors = validateLoginPayload(body);

  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const { token, user } = await authService.loginUser(body.email, body.password);

  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE_SECONDS
    })
  );

  sendJson(res, 200, {
    message: 'Login successful',
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
  });
}

async function logout(req, res, ctx) {
  await authService.logoutUser(ctx.user.id);

  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 0
    })
  );

  sendJson(res, 200, { message: 'Logged out successfully' });
}

async function me(req, res, ctx) {
  const user = await authService.getCurrentUser(ctx.user.id);

  sendJson(res, 200, { user });
}

module.exports = { register, login, logout, me };
