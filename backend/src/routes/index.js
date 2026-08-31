const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/geography', require('./geography.routes'));
router.use('/education', require('./education.routes'));
router.use('/schools', require('./schools.routes'));
router.use('/subscriptions', require('./subscriptions.routes'));
router.use('/payments', require('./payments.routes'));
router.use('/live-classes', require('./liveClasses.routes'));
router.use('/questions', require('./questions.routes'));
router.use('/recordings', require('./recordings.routes'));
router.use('/resources', require('./resources.routes'));
router.use('/quizzes', require('./quizzes.routes'));
router.use('/assignments', require('./assignments.routes'));
router.use('/submissions', require('./submissions.routes'));
router.use('/notifications', require('./notifications.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/lessons', require('./lessons.routes'));
router.use('/certificates', require('./certificates.routes'));
router.use('/parents', require('./parents.routes'));
router.use('/nursery-games', require('./nurseryGames.routes'));
router.use('/academic', require('./academic.routes'));
router.use('/advertisements', require('./advertisements.routes'));
router.use('/search', require('./search.routes'));
router.use('/setup-drafts', require('./setupDrafts.routes'));
router.use('/reports', require('./reports.routes'));

module.exports = router;

