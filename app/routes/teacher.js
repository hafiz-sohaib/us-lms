const controller = require('../controllers/student-controller');
const { isStudent } = require('../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();


router.get('/dashboard', isStudent, controller.dashboard);
router.get('/assignments', isStudent, controller.dashboard);
router.get('/notes', isStudent, controller.dashboard);
router.get('/opportunities', isStudent, controller.dashboard);
router.get('/timetable', isStudent, controller.dashboard);
router.get('/notice-board', isStudent, controller.dashboard);
router.get('/chat', isStudent, controller.dashboard);


module.exports = router;