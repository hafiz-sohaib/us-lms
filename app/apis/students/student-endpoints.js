const controller = require('./student-backend');
const { isLoggedIn, isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/students', isLoggedIn, isAdmin, controller.add_student);
router.get('/students', controller.get_students);
router.get('/c-students', controller.get_students_for_cred);
router.put('/students', isLoggedIn, isAdmin, controller.update_student);
router.delete('/students/:id', isAdmin, controller.delete_student);

module.exports = router;