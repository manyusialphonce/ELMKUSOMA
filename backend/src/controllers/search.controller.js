const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { search } = require('../services/search');

// GET /api/v1/search?q=algebra
const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) throw ApiError.badRequest('Query parameter "q" is required.');

  const results = await search(q);
  res.json({ data: results });
});

module.exports = { globalSearch };
