const controller = require('./exam-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/exams', isAdmin, controller.set_duty);
router.get('/exams', controller.get_duties);
router.delete('/exams/:id', isAdmin, controller.delete_duty);

module.exports = router;