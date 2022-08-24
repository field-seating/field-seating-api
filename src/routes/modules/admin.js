const express = require('express');
const adminController = require('../../controllers/admin-controller');

const router = express.Router();

router.get('/report/photos', adminController.getReportPhotos);

module.exports = router;
