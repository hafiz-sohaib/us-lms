const controller = require('../controllers/teacher-controller');
const { isTeacher } = require('../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();


router.get('/dashboard', isTeacher, controller.dashboard);
router.get('/profile', isTeacher, controller.profile);
router.get('/send-notification', isTeacher, controller.send_notification);


module.exports = router;