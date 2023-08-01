const controller = require('./auth-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/auth/sign-up', controller.sign_up);
router.post('/auth/sign-in', controller.sign_in);
router.post('/auth/admin', controller.add_admin);
router.get('/auth/sign-out', controller.sign_out);
router.get('/auth/credentials', isAdmin, controller.credentials);
router.put('/auth/block/:id', isAdmin, controller.block);
router.put('/auth/unblock/:id', isAdmin, controller.unblock);
router.put('/auth/admin/:id', isAdmin, controller.unblock);
router.get('/auth/pass/:id', isAdmin, controller.get_pass);
router.delete('/auth/admin/:id', isAdmin, controller.delete);

module.exports = router;