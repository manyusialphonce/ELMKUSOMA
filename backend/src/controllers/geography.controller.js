const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/v1/geography/regions?countryId=1
const listRegions = asyncHandler(async (req, res) => {
  const { countryId } = req.query;
  const regions = await prisma.region.findMany({
    where: countryId ? { countryId: Number(countryId) } : undefined,
    orderBy: { name: 'asc' },
  });
  res.json({ data: regions });
});

// GET /api/v1/geography/districts?regionId=1
const listDistricts = asyncHandler(async (req, res) => {
  const { regionId } = req.query;
  const districts = await prisma.district.findMany({
    where: regionId ? { regionId: Number(regionId) } : undefined,
    orderBy: { name: 'asc' },
  });
  res.json({ data: districts });
});

module.exports = { listRegions, listDistricts };
