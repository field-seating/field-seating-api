const express = require('express');
const fieldController = require('../../controllers/field-controller');

const router = express.Router();

router.get('/:id/zones', fieldController.getFieldZones);
router.get('/:id/levels', fieldController.getFieldsLevels);
router.get('/:id/orientations', fieldController.getFieldsOrientations);
router.get('/', fieldController.getFields);

module.exports = router;
