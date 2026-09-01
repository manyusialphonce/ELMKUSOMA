const { body } = require('express-validator');

const ALLOWED_SELF_REGISTER_ROLES = [
  'STUDENT',
  'TEACHER',
  'SCHOOL_ADMINISTRATOR',
  'PARENT',
  'ADVERTISER',
];

// =====================================================
// REGISTER VALIDATION RULES
// =====================================================

const registerRules = [

  body('fullName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ max: 255 })
    .withMessage('Full name must not exceed 255 characters.'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phoneNumber')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      'Phone number must not exceed 20 characters.'
    ),

  body('password')
    .isString()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage(
      'Password must be at least 8 characters.'
    )
    .matches(/[A-Z]/)
    .withMessage(
      'Password must contain an uppercase letter.'
    )
    .matches(/[a-z]/)
    .withMessage(
      'Password must contain a lowercase letter.'
    )
    .matches(/[0-9]/)
    .withMessage(
      'Password must contain a number.'
    ),

  body('role')
    .isString()
    .trim()
    .toUpperCase()
    .isIn(ALLOWED_SELF_REGISTER_ROLES)
    .withMessage(
      `Role must be one of: ${ALLOWED_SELF_REGISTER_ROLES.join(', ')}`
    ),

  body('gender')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isIn(['male', 'female'])
    .withMessage(
      'Gender must be either male or female.'
    ),

  body('dateOfBirth')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isISO8601()
    .withMessage(
      'Date of birth must be a valid date.'
    )
    .toDate(),

  body('educationLevelId')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isInt({ min: 1 })
    .withMessage(
      'Education level ID must be a valid number.'
    )
    .toInt(),

  body('regionId')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isInt({ min: 1 })
    .withMessage(
      'Region ID must be a valid number.'
    )
    .toInt(),

  body('districtId')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isInt({ min: 1 })
    .withMessage(
      'District ID must be a valid number.'
    )
    .toInt(),

  body('schoolId')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isInt({ min: 1 })
    .withMessage(
      'School ID must be a valid number.'
    )
    .toInt(),

  body('identityDocumentType')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isIn([
      'NIDA',
      'PASSPORT',
    ])
    .withMessage(
      'Identity document type must be NIDA or PASSPORT.'
    ),

  body('identityDocumentNumber')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage(
      'Identity document number must not exceed 50 characters.'
    ),

  body('facultyId')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isInt({ min: 1 })
    .withMessage(
      'Faculty ID must be a valid number.'
    )
    .toInt(),

];


// =====================================================
// LOGIN VALIDATION RULES
// =====================================================

const loginRules = [

  body('email')
    .isEmail()
    .withMessage(
      'Please provide a valid email address.'
    )
    .normalizeEmail(),

  body('password')
    .isString()
    .notEmpty()
    .withMessage(
      'Password is required.'
    ),

];


module.exports = {
  registerRules,
  loginRules,
  ALLOWED_SELF_REGISTER_ROLES,
};