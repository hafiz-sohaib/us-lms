const controller = require('./auth-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/auth/sign-up', controller.sign_up);
router.post('/auth/sign-in', controller.sign_in);
router.get('/auth/sign-out', controller.sign_out);
router.get('/auth/credentials', controller.credentials);
router.put('/auth/block/:id', isAdmin, controller.block);
router.put('/auth/unblock/:id', isAdmin, controller.unblock);

module.exports = router;