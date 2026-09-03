const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { logAction } = require('../utils/auditLog');

// GET /api/v1/geography/countries
const listCountries = asyncHandler(async (req, res) => {
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
  res.json({ data: countries });
});

// GET /api/v1/geography/regions?countryId=1
const listRegions = asyncHandler(async (req, res) => {
  const { countryId } = req.query;
  const regions = await prisma.region.findMany({
    where: countryId ? { countryId: Number(countryId) } : undefined,
    include: { country: true },
    orderBy: { name: 'asc' },
  });
  res.json({ data: regions });
});

// POST /api/v1/geography/regions  (Admin)
const createRegion = asyncHandler(async (req, res) => {
  const { countryId, name } = req.body;
  if (!countryId || !name) throw ApiError.badRequest('countryId and name are required.');

  const region = await prisma.region.create({
    data: { countryId: Number(countryId), name },
  });

  await logAction(req.user.id, 'region.create', { entity: 'Region', entityId: region.id });
  res.status(201).json({ data: region });
});

// GET /api/v1/geography/districts?regionId=1
const listDistricts = asyncHandler(async (req, res) => {
  const { regionId } = req.query;
  const districts = await prisma.district.findMany({
    where: regionId ? { regionId: Number(regionId) } : undefined,
    include: { region: true },
    orderBy: { name: 'asc' },
  });
  res.json({ data: districts });
});

// POST /api/v1/geography/districts  (Admin)
const createDistrict = asyncHandler(async (req, res) => {
  const { regionId, name } = req.body;
  if (!regionId || !name) throw ApiError.badRequest('regionId and name are required.');

  const district = await prisma.district.create({
    data: { regionId: Number(regionId), name },
  });

  await logAction(req.user.id, 'district.create', { entity: 'District', entityId: district.id });
  res.status(201).json({ data: district });
});

module.exports = { listCountries, listRegions, createRegion, listDistricts, createDistrict };
