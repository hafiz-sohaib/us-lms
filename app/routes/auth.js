const controller = require('../controllers/auth-controller');
const { Router } = require('express');
const router = Router();


router.get('/sign-up', controller.sign_up);
router.get('/sign-in', controller.sign_in);


module.exports = router;