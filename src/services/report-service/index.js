const { isEmpty, isNil } = require('ramda');
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
const resPagination = require('../helpers/response');
const { statusMap } = require('../../models/report/constant');

class ReportService extends BaseService {
  async postReport(photoId, content, { ip, userId = null } = {}) {
    // check photo exist
    const photoModel = new PhotoModel();
    const photo = await photoModel.getPhoto(parseInt(photoId));
    if (isNil(photo)) throw new GeneralError(reportErrorMap['wrongPhotoId']);

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
      return {
        reportPhotos: [],
        pagination: resPagination(),
      };

    // render report's photos response
    const reportPhotosData = renderReportPhotosResponse(
      reportPhotos.data,
      sizeMap.seatPhoto,
      bucketMap.photos
    );

    const result = {
      reportPhotos: reportPhotosData,
      pagination: resPagination(reportPhotos.cursorId),
    };
    return result;
  }
  async putReportsByReportId(reportId, status) {
    // check report exist and status is pending
    const reportModel = new ReportModel();
    const report = await reportModel.getReportByReportId(parseInt(reportId));
    if (!report) throw new GeneralError(reportErrorMap['wrongReportId']);
    if (report && report.status !== statusMap.pending)
      throw new GeneralError(reportErrorMap['reportAlreadyResolve']);

    // put reports by photoId
    const photoId = report.photoId;
    const putReports = await reportModel.putPendingReports(photoId, status);

    // delete photo if status is deleted
    if (status === statusMap.deleted) {
      const photoModel = new PhotoModel();
      await photoModel.deletePhoto(photoId);
    }

    return putReports;
  }
}

module.exports = ReportService;
