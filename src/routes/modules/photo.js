const express = require('express');
const photoController = require('../../controllers/photo-controller');
const { uploadImages } = require('../../middleware/upload-images');
const { uploadAuthenticate } = require('../../middleware/auth');

const router = express.Router();

router.get('/', photoController.getPhotos);
router.post('/', uploadAuthenticate, uploadImages, photoController.postPhotos);

module.exports = router;
