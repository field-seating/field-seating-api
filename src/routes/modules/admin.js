const express = require('express');
const adminController = require('../../controllers/admin-controller');

const router = express.Router();

router.put('/reports/:id/resolve', adminController.putReportsByReportId);
router.get('/reports', adminController.getReportPhotos);

module.exports = router;
