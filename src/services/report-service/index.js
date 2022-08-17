const { isEmpty } = require('ramda');
const GeneralError = require('../../errors/error/general-error');
const PhotoModel = require('../../models/photo');
const BaseService = require('../base');
const reportErrorMap = require('../../errors/report-error');
const ReportModel = require('../../models/report');
const rateLimiterHelper = require('../../utils/rate-limiter');
const { postReportRateLimit } = require('../../config/config');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');

class ReportService extends BaseService {
  async postReport(photoId, content, { ip, userId = null } = {}) {
    // check photo exist
    const photoModel = new PhotoModel();
    const photoCheck = await photoModel.getPhoto(parseInt(photoId));
    if (!photoCheck) throw new GeneralError(reportErrorMap['wrongPhotoId']);

    // if is a user, check report exist
    const reportModel = new ReportModel();

    if (userId) {
      const report = await reportModel.getReport(photoId, userId);
      if (!isEmpty(report))
        throw new GeneralError(reportErrorMap['duplicateError']);
    }

    // post report
    async function createReport() {
      const newReport = await reportModel.createReport(
        photoId,
        content,
        userId
      );
      return newReport;
    }

    // set rate limit use userId or ip by auth or not
    const withRateLimit = userId
      ? rateLimiterHelper({
          windowSize: postReportRateLimit.windowSize,
          limit: postReportRateLimit.limit,
          key: `postReportService:${userId}`,
        })
      : rateLimiterHelper({
          windowSize: postReportRateLimit.windowSize,
          limit: postReportRateLimit.limit,
          key: `postReportService:${ip}`,
        });

    try {
      //create report with rate limit
      const info = await withRateLimit(createReport)();
      this.logger.info('post report', { info });
      return info;
    } catch (err) {
      if (err.code === rateLimiterErrorMap.exceedLimit.code) {
        throw new GeneralError(reportErrorMap.exceedLimitError);
      }
      throw err;
    }
  }
}

module.exports = ReportService;
