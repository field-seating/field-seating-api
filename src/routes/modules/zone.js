const express = require('express');
const zoneController = require('../../controllers/zone-controller');

const router = express.Router();
router.get('/:id/spaces', zoneController.getSpacesByZone);

module.exports = router;
