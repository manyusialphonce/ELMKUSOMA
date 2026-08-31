const { body } = require('express-validator');

const createQuizRules = [
  body('subjectId').isInt(),
  body('title').isString().trim().notEmpty(),
  body('attemptLimit').optional().isInt({ min: 1 }),
  body('passingScore').optional().isInt({ min: 0 }),
  body('questions').isArray({ min: 1 }),
  body('questions.*.type').isIn(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']),
  body('questions.*.questionText').isString().trim().notEmpty(),
];

const submitAttemptRules = [
  body('answers').isArray({ min: 1 }),
  body('answers.*.quizQuestionId').isInt(),
];

module.exports = { createQuizRules, submitAttemptRules };
