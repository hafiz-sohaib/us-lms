const controller = require('./auth-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/auth/sign-up', controller.sign_up);
router.post('/auth/sign-in', controller.sign_in);
router.get('/auth/credentails', isAdmin, controller.credentails);
router.get('/auth/sign-out', controller.sign_out);
router.put('/auth/block', isAdmin, controller.block);
router.put('/auth/unblock', isAdmin, controller.unblock);

module.exports = router;