const express = require('express');
const photoController = require('../../controllers/photo-controller');
const { uploadImages } = require('../../middleware/multer');

const router = express.Router();

router.post('/', uploadImages, photoController.postPhotos);

module.exports = router;
