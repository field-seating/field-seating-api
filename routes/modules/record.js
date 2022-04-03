const express = require('express');
const recordController = require('../../controllers/record-controller');
const router = express.Router();

router.post('/', recordController.postRecord);

module.exports = router;
