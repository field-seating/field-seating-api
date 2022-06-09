const express = require('express');
const zoneController = require('../../controllers/zone-controller');

const router = express.Router();
router.get('/:id/spaces', zoneController.getZoneSpaces);

module.exports = router;
