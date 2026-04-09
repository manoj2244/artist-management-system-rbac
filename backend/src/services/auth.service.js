const { AppError } = require('../utils/errors');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const authRepository = require('../repositories/auth.repository');
const { ROLES } = require('../constants/roles');

async function registerUser(data) {
  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new AppError(409, 'Email already in use');
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await authRepository.createUser({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    dob: data.dob,
    gender: data.gender,
    address: data.address,
    role: ROLES.ARTIST_MANAGER
  });

  return newUser;
}

async function loginUser(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    token_version: user.token_version
  });

  return { token, user };
}

async function logoutUser(userId) {
  await authRepository.incrementTokenVersion(userId);
}

async function getCurrentUser(userId) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
