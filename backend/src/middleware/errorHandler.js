const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      error = ApiError.conflict(`A record with this ${error.meta?.target?.join(', ')} already exists.`);
    } else if (error.code === 'P2025') {
      error = ApiError.notFound();
    } else {
      error = ApiError.internal(
        process.env.NODE_ENV === 'production' ? undefined : error.message
      );
    }
  }

  if (process.env.NODE_ENV !== 'production' && error.statusCode === 500) {
    console.error(err);
  }

  res.status(error.statusCode).json({
    message: error.message,
    errors: error.details || undefined,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
}

module.exports = { errorHandler, notFoundHandler };
