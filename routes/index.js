const express = require('express');
const testController = require('../controllers/test-controller');
const record = require('./modules/record');
const user = require('./modules/user');
const router = express.Router();

router.post('/api/echo', testController.postEcho);
router.use('/api/users', user);
router.use('/api/records', record);

module.exports = router;
