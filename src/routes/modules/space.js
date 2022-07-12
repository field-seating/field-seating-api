const express = require('express');
const spaceController = require('../../controllers/space-controller');

const router = express.Router();
router.get('/:id/photos', spaceController.getSpacePhotos);
router.get('/:id', spaceController.getSpace);

module.exports = router;
