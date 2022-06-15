const express = require('express');
const fieldController = require('../../controllers/field-controller');

const router = express.Router();

router.get('/:id/zones', fieldController.getFieldZones);
router.get('/:id/levels', fieldController.getFieldLevels);
router.get('/:id/orientations', fieldController.getFieldOrientations);
router.get('/:id', fieldController.getField);
router.get('/', fieldController.getFields);

module.exports = router;
