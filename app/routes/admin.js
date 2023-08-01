const controller = require('../controllers/admin-controller');
const { isAdmin, isLoggedIn } = require('../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();


router.get('/dashboard', isLoggedIn, isAdmin, controller.dashboard);
router.get('/students', isLoggedIn, isAdmin, controller.students);
router.get('/teachers', isLoggedIn, isAdmin, controller.teachers);
router.get('/manage-admin', isLoggedIn, isAdmin, controller.manage_admin);
router.get('/upload-notices', isLoggedIn, isAdmin, controller.upload_notices);
router.get('/exam-duties', isLoggedIn, isAdmin, controller.exam_duties);


module.exports = router;