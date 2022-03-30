const express = require('express');
const testController = require('../controllers/test-controller');
const user = require('./modules/user');
const router = express.Router();

router.post('/api/echo', testController.postEcho);
router.use('/api/users', user);

module.exports = router;
