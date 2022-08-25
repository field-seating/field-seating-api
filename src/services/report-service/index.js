const { isEmpty } = require('ramda');
const GeneralError = require('../../errors/error/general-error');
const PhotoModel = require('../../models/photo');
const BaseService = require('../base');
const reportErrorMap = require('../../errors/report-error');
const ReportModel = require('../../models/report');
const rateLimiterHelper = require('../../utils/rate-limiter');
const { postReportRateLimit } = require('../../config/config');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');
const renderReportPhotosResponse = require('../helpers/render-report-photos-response-helper');
const { sizeMap } = require('../../constants/resize-constant');
const { bucketMap } = require('../../constants/upload-constant');
const resWithPagination = require('../helpers/response');

class ReportService extends BaseService {
  async postReport(photoId, content, { ip, userId = null } = {}) {
    // check photo exist
    const photoModel = new PhotoModel();
    const hasPhoto = await photoModel.getPhoto(parseInt(photoId));
    if (!hasPhoto) throw new GeneralError(reportErrorMap['wrongPhotoId']);

    // if is a user, check report exist
    const reportModel = new ReportModel();

    const reports = userId
      ? await reportModel.getReportsByPhotoIdAndUserId(photoId, userId)
      : [];

    if (!isEmpty(reports)) return reports;

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
          key: `postReportService:${userId}-${photoId}`,
        })
      : rateLimiterHelper({
          windowSize: postReportRateLimit.windowSize,
          limit: postReportRateLimit.limit,
          key: `postReportService:${ip}-${photoId}`,
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
  async getReportPhotos(paginationOption) {
    // get reportPhotos
    const reportModel = new ReportModel();
    const reportPhotos = await reportModel.getReportsPhotos(paginationOption);

    // if no report's photos data
    if (isEmpty(reportPhotos.data))
      return resWithPagination({
        dataName: 'reportPhotos',
      });

    // render report's photos response
    const reportPhotosData = renderReportPhotosResponse(
      reportPhotos.data,
      sizeMap.seatPhoto,
      bucketMap.photos
    );
    const dataset = {
      dataName: 'reportPhotos',
      data: reportPhotosData,
      cursorId: reportPhotos.cursorId,
    };
    return resWithPagination(dataset);
  }
}

module.exports = ReportService;
