const express = require('express');
const recordController = require('../../controllers/record-controller');
const { uploadImages } = require('../../middleware/multer');
// const uploadDo = require('../../services/helpers/upload-image');
const router = express.Router();

router.post(
  '/',
  uploadImages,
  // resizeImages,
  // uploadDo,
  recordController.postRecord
);

module.exports = router;
