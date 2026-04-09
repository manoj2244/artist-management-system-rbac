const { AppError } = require('../utils/errors');
const { hashPassword } = require('../utils/password');
const usersRepository = require('../repositories/users.repository');

async function listUsers(page, limit, offset) {
  const [users, total] = await Promise.all([
    usersRepository.findAllUsers(limit, offset),
    usersRepository.countAllUsers()
  ]);

  return { users, total, page, limit };
}

async function getUserById(id) {
  const user = await usersRepository.findUserById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

async function createUser(data) {
  const existingUser = await usersRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new AppError(409, 'Email already in use');
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await usersRepository.createUser({
    ...data,
    password: hashedPassword
  });

  return newUser;
}

async function updateUser(id, data) {
  const existingUser = await usersRepository.findUserById(id);
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  if (data.email !== existingUser.email) {
    const emailTaken = await usersRepository.findUserByEmail(data.email);
    if (emailTaken) {
      throw new AppError(409, 'Email already in use');
    }
  }

  const updatedUser = await usersRepository.updateUser(id, data);
  return updatedUser;
}

async function deleteUser(id) {
  const deleted = await usersRepository.deleteUser(id);
  if (!deleted) {
    throw new AppError(404, 'User not found');
  }
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
