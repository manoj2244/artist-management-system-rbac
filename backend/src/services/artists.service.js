const { AppError } = require('../utils/errors');
const { formatCSV, parseCSV } = require('../utils/csv');
const {
  isNonEmptyString,
  isPastDate,
  isValidGender,
  isValidYear,
  isNonNegativeInteger
} = require('../utils/validators');
const artistsRepository = require('../repositories/artists.repository');

const CSV_HEADERS = ['name', 'dob', 'gender', 'address', 'first_release_year', 'no_of_albums_released'];

function validateArtistData(data) {
  const errors = {};

  if (!isNonEmptyString(data.name)) errors.name = 'Required';
  if (!isPastDate(data.dob)) errors.dob = 'Valid past date required (YYYY-MM-DD)';
  if (!isValidGender(data.gender)) errors.gender = 'Must be m, f, or o';
  if (!isNonEmptyString(data.address)) errors.address = 'Required';
  if (!isValidYear(data.first_release_year)) {
    errors.first_release_year = 'Valid year between 1900 and next year required';
  }
  if (!isNonNegativeInteger(data.no_of_albums_released)) {
    errors.no_of_albums_released = 'Must be a non-negative integer';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

async function getArtistsForDropdown() {
  return artistsRepository.findAllArtistsForDropdown();
}

async function listArtists(page, limit, offset) {
  const [artists, total] = await Promise.all([
    artistsRepository.findAllArtists(limit, offset),
    artistsRepository.countAllArtists()
  ]);

  return { artists, total, page, limit };
}

async function getArtistById(id) {
  const artist = await artistsRepository.findArtistById(id);
  if (!artist) {
    throw new AppError(404, 'Artist not found');
  }
  return artist;
}

async function createArtist(data) {
  const validationErrors = validateArtistData(data);
  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const artist = await artistsRepository.createArtist({
    name: data.name.trim(),
    dob: data.dob,
    gender: data.gender,
    address: data.address.trim(),
    first_release_year: parseInt(data.first_release_year, 10),
    no_of_albums_released: parseInt(data.no_of_albums_released, 10)
  });

  return artist;
}

async function updateArtist(id, data) {
  const existingArtist = await artistsRepository.findArtistById(id);
  if (!existingArtist) {
    throw new AppError(404, 'Artist not found');
  }

  const validationErrors = validateArtistData(data);
  if (validationErrors) {
    throw new AppError(422, 'Validation failed', validationErrors);
  }

  const updatedArtist = await artistsRepository.updateArtist(id, {
    name: data.name.trim(),
    dob: data.dob,
    gender: data.gender,
    address: data.address.trim(),
    first_release_year: parseInt(data.first_release_year, 10),
    no_of_albums_released: parseInt(data.no_of_albums_released, 10)
  });

  return updatedArtist;
}

async function deleteArtist(id) {
  const deleted = await artistsRepository.deleteArtist(id);
  if (!deleted) {
    throw new AppError(404, 'Artist not found');
  }
}

async function exportArtistsCSV() {
  const artists = await artistsRepository.findAllArtistsForExport();
  return formatCSV(CSV_HEADERS, artists);
}

async function importArtistsCSV(csvText) {
  const { headers, rows } = parseCSV(csvText);

  const missingHeaders = CSV_HEADERS.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new AppError(422, `CSV missing required columns: ${missingHeaders.join(', ')}`);
  }

  if (rows.length === 0) {
    throw new AppError(422, 'CSV file has no data rows');
  }

  const inserted = [];
  const failed = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2;

    const validationErrors = validateArtistData(row);
    if (validationErrors) {
      failed.push({ row: rowNumber, errors: validationErrors });
      continue;
    }

    try {
      const artist = await artistsRepository.createArtist({
        name: row.name.trim(),
        dob: row.dob,
        gender: row.gender,
        address: row.address.trim(),
        first_release_year: parseInt(row.first_release_year, 10),
        no_of_albums_released: parseInt(row.no_of_albums_released, 10)
      });
      inserted.push(artist.id);
    } catch {
      failed.push({ row: rowNumber, errors: { general: 'Failed to insert row' } });
    }
  }

  return { inserted_count: inserted.length, failed_count: failed.length, failed };
}

module.exports = {
  getArtistsForDropdown,
  listArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  exportArtistsCSV,
  importArtistsCSV
};
