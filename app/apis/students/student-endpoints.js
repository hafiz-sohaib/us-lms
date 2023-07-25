const controller = require('./student-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/students', isAdmin, controller.add_student);
router.get('/students', controller.get_students);
router.get('/students-cred', isAdmin, controller.get_students_cred);
router.post('/students-cred-send', isAdmin, controller.sned_cred);
router.put('/students', isAdmin, controller.update_student);
router.delete('/students/:id', isAdmin, controller.delete_student);

module.exports = router;