const express = require('express');
const photoController = require('../../controllers/photo-controller');
const { uploadImages } = require('../../middleware/upload-images');
const { authenticated } = require('../../middleware/auth');

const router = express.Router();

router.post('/', authenticated, uploadImages, photoController.postPhotos);

module.exports = router;
