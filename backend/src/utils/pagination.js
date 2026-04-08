function parsePagination(query, defaults = { page: 1, limit: 10, maxLimit: 100 }) {
  const pageValue = Number.parseInt(query.page, 10);
  const limitValue = Number.parseInt(query.limit, 10);

  const page = Number.isNaN(pageValue) || pageValue < 1 ? defaults.page : pageValue;

  let limit = Number.isNaN(limitValue) || limitValue < 1 ? defaults.limit : limitValue;
  if (limit > defaults.maxLimit) {
    limit = defaults.maxLimit;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports = { parsePagination };
