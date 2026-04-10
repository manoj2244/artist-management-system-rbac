const { AppError } = require('../utils/errors');
const { hashPassword } = require('../utils/password');
const usersRepository = require('../repositories/users.repository');
const { ROLES } = require('../constants/roles');

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

  if (data.role === ROLES.ARTIST && !data.artist_id) {
    throw new AppError(422, 'Validation failed', { artist_id: 'Required when role is artist' });
  }

  if (data.artist_id) {
    const alreadyLinked = await usersRepository.findArtistLinkByArtistId(data.artist_id);
    if (alreadyLinked) {
      throw new AppError(409, 'This artist profile is already linked to another user account');
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = await usersRepository.createUser({
    ...data,
    password: hashedPassword
  });

  if (data.role === ROLES.ARTIST && data.artist_id) {
    await usersRepository.createArtistUserLink(newUser.id, data.artist_id);
  }

  return usersRepository.findUserById(newUser.id);
}

async function updateUser(id, data) {
  const existingUser = await usersRepository.findUserById(id);
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  if (data.role === ROLES.ARTIST && !data.artist_id) {
    throw new AppError(422, 'Validation failed', { artist_id: 'Required when role is artist' });
  }

  if (data.email !== existingUser.email) {
    const emailTaken = await usersRepository.findUserByEmail(data.email);
    if (emailTaken) {
      throw new AppError(409, 'Email already in use');
    }
  }

  if (data.artist_id && String(data.artist_id) !== String(existingUser.artist_id)) {
    const alreadyLinked = await usersRepository.findArtistLinkByArtistId(data.artist_id);
    if (alreadyLinked) {
      throw new AppError(409, 'This artist profile is already linked to another user account');
    }
  }

  await usersRepository.updateUser(id, data);

  await usersRepository.deleteArtistUserLinkByUserId(id);

  if (data.role === ROLES.ARTIST && data.artist_id) {
    await usersRepository.createArtistUserLink(id, data.artist_id);
  }

  return usersRepository.findUserById(id);
}

async function deleteUser(id) {
  const deleted = await usersRepository.deleteUser(id);
  if (!deleted) {
    throw new AppError(404, 'User not found');
  }
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };
