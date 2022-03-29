const { apiErrorHandler } = require('../middleware/error-handler');
const testController = require('../controllers/test-controller');
const express = require('express');
const router = express.Router();
const user = require('./modules/user');

router.post('/api/echo', testController.postEcho);
router.use('/api/users', user);
router.use('/', apiErrorHandler);

module.exports = router;
