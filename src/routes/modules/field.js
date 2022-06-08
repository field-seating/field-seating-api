const express = require('express');
const fieldController = require('../../controllers/field-controller');

const router = express.Router();

router.get('/:id/zones', fieldController.getZonesByField);
router.get('/:id/levels', fieldController.getLevelsByField);
router.get('/:id/orientations', fieldController.getOrientationsByField);
router.get('/', fieldController.getFields);

module.exports = router;
