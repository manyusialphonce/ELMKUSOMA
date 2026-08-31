const { body } = require('express-validator');

const ALLOWED_SELF_REGISTER_ROLES = ['STUDENT', 'TEACHER', 'SCHOOL_ADMINISTRATOR', 'PARENT', 'ADVERTISER'];

const registerRules = [
  body('fullName').isString().trim().notEmpty().isLength({ max: 255 }),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').optional({ nullable: true }).isString().isLength({ max: 20 }),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain a number.'),
  body('role')
    .isString()
    .isIn(ALLOWED_SELF_REGISTER_ROLES)
    .withMessage('role must be one of: ' + ALLOWED_SELF_REGISTER_ROLES.join(', ')),
  body('gender').optional({ nullable: true }).isIn(['male', 'female']),
  body('dateOfBirth').optional({ nullable: true }).isISO8601(),
  body('educationLevelId').optional({ nullable: true }).isInt(),
  body('regionId').optional({ nullable: true }).isInt(),
  body('districtId').optional({ nullable: true }).isInt(),
  body('schoolId').optional({ nullable: true }).isInt(),
  // Identity verification — required in practice for TEACHER role before
  // they can publish content, collected optionally at registration time.
  body('identityDocumentType').optional({ nullable: true }).isIn(['NIDA', 'PASSPORT']),
  body('identityDocumentNumber').optional({ nullable: true }).isString().isLength({ max: 50 }),
  body('facultyId').optional({ nullable: true }).isInt(),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
];

module.exports = { registerRules, loginRules };
