const controller = require('./teacher-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/teachers', isAdmin, controller.add_teacher);
router.get('/teachers', controller.get_teachers);
router.get('/teachers-cred', isAdmin, controller.get_teachers_cred);
router.post('/teachers-cred-send', isAdmin, controller.sned_cred);
router.put('/teachers', isAdmin, controller.update_teacher);
router.delete('/teachers/:id', isAdmin, controller.delete_teacher);

module.exports = router;