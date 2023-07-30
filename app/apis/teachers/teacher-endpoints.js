const controller = require('./teacher-backend');
const { isLoggedIn, isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/teachers', isLoggedIn, isAdmin, controller.add_teacher);
router.get('/teachers', controller.get_teachers);
router.get('/c-teachers', controller.get_teachers_for_cred);
router.put('/teachers', isLoggedIn, isAdmin, controller.update_teacher);
router.delete('/teachers/:id', isAdmin, controller.delete_teacher);

module.exports = router;