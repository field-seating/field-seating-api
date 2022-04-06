const express = require('express');
const recordController = require('../../controllers/record-controller');
const { uploadImages, resizeImages } = require('../../middleware/multer');
const router = express.Router();

router.post('/', uploadImages, resizeImages, recordController.postRecord);

module.exports = router;
