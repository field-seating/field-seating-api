const resSuccess = require('./helpers/response');
const ReportService = require('../services/report-service');
const { paginationLimitMap } = require('../constants/pagination-constant');

const adminController = {
  getReportPhotos: async (req, res, next) => {
    try {
      const limit = req.query.limit
        ? Number(req.query.limit)
        : paginationLimitMap.reports;

      // get reportPhotos
      const reportService = new ReportService({ logger: req.logger });
      const result = await reportService.getReportPhotos(limit);

      res.status(200).json(resSuccess(result));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
