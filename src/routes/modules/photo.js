const express = require('express');
const recordController = require('../../controllers/photo-controller');
const { uploadImages } = require('../../middleware/multer');

const router = express.Router();

router.post('/', uploadImages, recordController.postPhotos);

module.exports = router;
