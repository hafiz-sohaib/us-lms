const controller = require('./notice-backend');
const { isAdmin } = require('../../middlewares/auth-middleware');
const { Router } = require('express');
const router = Router();

router.post('/notices', isAdmin, controller.upload_notice);
router.get('/notices', controller.get_notices);
router.delete('/notices/:id', controller.delete_notice);

module.exports = router;