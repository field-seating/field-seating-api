const express = require('express');
const photoController = require('../../controllers/photo-controller');
const { uploadImages } = require('../../middleware/upload-images');
const { bindUser } = require('../../middleware/auth');

const router = express.Router();

router.get('/', photoController.getPhotos);
router.post('/', bindUser, uploadImages, photoController.postPhotos);

module.exports = router;
