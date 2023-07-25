const controller = require('../controllers/admin-controller');
const { isAdmin, isLoggedIn } = require('../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();


router.get('/dashboard', isLoggedIn, isAdmin, controller.dashboard);
router.get('/students', isLoggedIn, isAdmin, controller.students);
router.get('/teachers', isLoggedIn, isAdmin, controller.teachers);


module.exports = router;