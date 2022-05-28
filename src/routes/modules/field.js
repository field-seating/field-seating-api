const express = require('express');
const fieldController = require('../../controllers/field-controller');

const router = express.Router();

router.get('/', fieldController.getFields);

module.exports = router;
