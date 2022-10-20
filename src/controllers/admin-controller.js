const resSuccess = require('./helpers/response');
const ReportService = require('../services/report-service');
const { paginationLimitMap } = require('../constants/pagination-constant');
const { statusMap } = require('../models/report/constant');

const adminController = {
  getReportPhotos: async (req, res, next) => {
    try {
      const limit = req.query.limit;
      const filter = req.query.filter;

      const paginationOption = {
        limit: limit ? Number(limit) : paginationLimitMap.reports,
        filter: filter ? filter.toLowerCase() : statusMap.pending,
      };
      // get reportPhotos
      const reportService = new ReportService({ logger: req.logger });
      const result = await reportService.getReportPhotos(paginationOption);

      res.status(200).json(resSuccess(result));
    } catch (err) {
      next(err);
    }
  },
  putReportsByReportId: async (req, res, next) => {
    try {
      const reportId = req.params.id;
      const status = req.body.status;

      // put reports
      const reportService = new ReportService({ logger: req.logger });
      const result = await reportService.putReportsByReportId(reportId, status);

      res.status(200).json(resSuccess(result));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
