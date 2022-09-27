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
const { statusMap, reporterTypeMap } = require('../../models/report/constant');

// practice Map
const reporterTypeJsMap = new Map(Object.entries(reporterTypeMap));

class ReportService extends BaseService {
  async postReport(photoId, reporter, content) {
    // if no reporter
    if (isNil(reporter))
      throw new GeneralError(reportErrorMap['reporterDoesNotExist']);

    const { id, type } = reporter;

    // judge type
    if (!reporterTypeJsMap.has(type))
      throw new GeneralError(reportErrorMap['wrongReporterType']);

    // check photo exist
    const photoModel = new PhotoModel();
    const photo = await photoModel.getPhoto(parseInt(photoId));
    if (isNil(photo)) throw new GeneralError(reportErrorMap['wrongPhotoId']);

    // create report function
    async function createReport() {
      const reportModel = new ReportModel();
      // if reporter is user
      if (type === reporterTypeJsMap.get('USERID')) {
        // check the user has reported before or not
        const reports = await reportModel.getReportsByPhotoIdAndUserId(
          photoId,
          id
        );

        if (!isEmpty(reports)) return reports;

        // post report
        const newReport = await reportModel.createReport(photoId, content, id);
        return newReport;
      }
      // if reporter is visitor
      if (type === reporterTypeJsMap.get('IP')) {
        const newReport = await reportModel.createReport(photoId, content);
        return newReport;
      }
    }

    // set rate limit by id
    const withRateLimit = rateLimiterHelper({
      windowSize: postReportRateLimit.windowSize,
      limit: postReportRateLimit.limit,
      key: `postReportService:${id}-${photoId}`,
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
