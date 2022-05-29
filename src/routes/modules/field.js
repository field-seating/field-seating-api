const express = require('express');
const fieldController = require('../../controllers/field-controller');

const router = express.Router();

router.get('/:id/levels', fieldController.getFields);
router.get('/:id/orientations', fieldController.getFields);
router.get('/', fieldController.getFields);

module.exports = router;
