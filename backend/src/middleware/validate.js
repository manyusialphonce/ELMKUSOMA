const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after an array of express-validator checks; converts failures into
// our standard ApiError.validation() shape instead of express-validator's own.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.validation(errors.array()));
  }
  next();
}

module.exports = validate;
