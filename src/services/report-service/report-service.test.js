const assert = require('assert/strict');
const { isNil } = require('ramda');
const PhotoModel = require('../../models/photo');
const FieldModel = require('../../models/field');
const LevelModel = require('../../models/level');
const OrientationModel = require('../../models/orientation');
const ZoneModel = require('../../models/zone');
const SpaceModel = require('../../models/space');
const SeatModel = require('../../models/seat');
const UserModel = require('../../models/user');
const UserService = require('../user-service');
const ReportModel = require('../../models/report');
const ReportService = require('../report-service');
const reportErrorMap = require('../../errors/report-error');
const { paginationLimitMap } = require('../../constants/pagination-constant');
const { statusMap, reporterTypeMap } = require('../../models/report/constant');

afterEach(async () => {
  const userModel = new UserModel();
  const photoModel = new PhotoModel();
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const seatModel = new SeatModel();
  const spaceModel = new SpaceModel();
  const reportModel = new ReportModel();
  await reportModel._truncate();
  await photoModel._truncate();
  await seatModel._truncate();
  await spaceModel._truncate();
  await zoneModel._truncate();
  await orientationModel._truncate();
  await levelModel._truncate();
  await fieldModel._truncate();
  await userModel._truncate();
});

const userService = new UserService({
  logger: console,
});

const reportService = new ReportService({
  logger: console,
});

describe('report-service.postReport', () => {
  describe('with regular input by a user', () => {
    it('should return report data with userId and status pending', async () => {
      // create user
      const name = 'testPhoto';
      const email = 'testphoto@example.com';
      const password = 'qwerasdf';
      const newUser = await userService.signUp(name, email, password);

      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report
      const content = '回報測試';
      const reporter = { id: userId, type: reporterTypeMap.USER_ID };
      const newReport = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );

      expect(newReport.photoId).toBe(newPhoto.id);
      expect(newReport.userId).toBe(userId);
      expect(newReport.content).toBe(content);
      expect(newReport.status).toBe(statusMap.pending);
    });
  });

  describe('with duplicate report by a user', () => {
    it('should return the exist report info', async () => {
      // create user
      const name = 'testPhoto';
      const email = 'testphoto@example.com';
      const password = 'qwerasdf';
      const newUser = await userService.signUp(name, email, password);

      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report
      const content = '回報測試';
      const reporter = { id: userId, type: reporterTypeMap.USER_ID };
      // create first time
      await reportService.postReport(newPhoto.id, reporter, content);
      //create again (to check only one data in DB)
      const newReport = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );

      expect(newReport).toHaveLength(1); //to check only one data in DB
      expect(newReport[0].photoId).toBe(newPhoto.id);
      expect(newReport[0].userId).toBe(userId);
      expect(newReport[0].content).toBe(content);
      expect(newReport[0].status).toBe(statusMap.pending);
    });
  });

  describe('without existed photo', () => {
    it('should return wrongPhotoId error', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const spaceId = newSpace.id;
      const userId = null;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report
      const content = '回報測試';
      const fakePhotoId = newPhoto.id + 1;
      const reporter = { id: userId, type: reporterTypeMap.USER_ID };
      await assert.rejects(
        async () => {
          await reportService.postReport(fakePhotoId, reporter, content);
        },
        {
          code: reportErrorMap.wrongPhotoId.code,
        }
      );
    });
  });

  describe('with regular input by a visitor', () => {
    it('should return report data with userId=null and status pending', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const spaceId = newSpace.id;
      const userId = null;
      const reportIp = '0.0.0';
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const newReport = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );

      expect(newReport.photoId).toBe(newPhoto.id);
      expect(newReport.userId).toBe(userId);
      expect(newReport.content).toBe(content);
      expect(newReport.status).toBe(statusMap.pending);
    });
  });

  describe('with regular input by a visitor without content', () => {
    it('should return report data with userId=null and status pending', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const spaceId = newSpace.id;
      const userId = null;
      const reportIp = '0.0.0';
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const newReport = await reportService.postReport(newPhoto.id, reporter);

      expect(newReport.photoId).toBe(newPhoto.id);
      expect(newReport.userId).toBe(userId);
      expect(newReport.content).toBe(null);
      expect(newReport.status).toBe(statusMap.pending);
    });
  });

  describe('without reporter', () => {
    it('should return reporterDoesNotExist error', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const spaceId = newSpace.id;
      const userId = null;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report with no reporter
      const reporter = null;

      await assert.rejects(
        async () => {
          await reportService.postReport(newPhoto.id, reporter);
        },
        {
          code: reportErrorMap.reporterDoesNotExist.code,
        }
      );
    });
  });

  describe('with wrong reporter type', () => {
    it('should return reporterDoesNotExist error', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const spaceId = newSpace.id;
      const userId = null;
      const reportIp = '0.0.0';
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create report with no reporter
      const reporter = { id: reportIp, type: 'fakeType' };

      await assert.rejects(
        async () => {
          await reportService.postReport(newPhoto.id, reporter);
        },
        {
          code: reportErrorMap.wrongReporterType.code,
        }
      );
    });
  });
});

describe('report-service.putReportsByReportId', () => {
  describe('with status deleted', () => {
    it('should return success and delete photo', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create  two report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const report = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );
      await reportService.postReport(newPhoto.id, reporter, content);

      // put report by status: deleted
      const putReports = await reportService.putReportsByReportId(
        report.id,
        'deleted'
      );

      // data check photo was deleted
      const deletedPhoto = await photoModel.getPhoto(newPhoto.id);
      const photoDeleted = isNil(deletedPhoto);

      expect(putReports.count).toBe(2);
      expect(photoDeleted).toBe(true);
    });
  });
  describe('with status no_issue', () => {
    it('should return success and not delete photo', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create  two report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const report = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );
      await reportService.postReport(newPhoto.id, reporter, content);

      // put report by status: deleted
      const putReports = await reportService.putReportsByReportId(
        report.id,
        'no_issue'
      );

      // data check photo was not deleted
      const reportPhoto = await photoModel.getPhoto(newPhoto.id);

      expect(putReports.count).toBe(2);
      expect(reportPhoto.id).toBe(newPhoto.id);
    });
  });
  describe('with initial status not pending', () => {
    it('should return reportAlreadyResolve error ', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create  two report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const report = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );
      await reportService.postReport(newPhoto.id, reporter, content);

      // put report by status: deleted
      await reportService.putReportsByReportId(report.id, 'no_issue');

      // put report when the report is already be 'no_issue'
      await assert.rejects(
        async () => {
          await reportService.putReportsByReportId(report.id, 'no_issue');
        },
        {
          code: reportErrorMap.reportAlreadyResolve.code,
        }
      );
    });
  });
  describe('without exist reportId', () => {
    it('should return wrongReportId error ', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create test photo data
      const path = 'testPhotoPath';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const newPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // create one report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const report = await reportService.postReport(
        newPhoto.id,
        reporter,
        content
      );

      // put report
      await reportService.postReport(newPhoto.id, reporter, content);

      // make a fake reportId
      const fakeReportId = report.id + 100;

      // put the fake reportId
      await assert.rejects(
        async () => {
          await reportService.putReportsByReportId(fakeReportId, 'no_issue');
        },
        {
          code: reportErrorMap.wrongReportId.code,
        }
      );
    });
  });
});

describe('report-service.getReportsPhotos', () => {
  describe('with filter pending', () => {
    it('should return reports which status is pending', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create two test photo data
      const path = 'testPhotoPath';
      const path2 = 'testPhotoPath2';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const firstPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );
      const secondPhoto = await photoModel.createPhoto(
        path2,
        userId,
        spaceId,
        dateTime
      );

      // create  two report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const firstReport = await reportService.postReport(
        firstPhoto.id,
        reporter,
        content
      );
      await reportService.postReport(secondPhoto.id, reporter, content);

      // put first report's status be no_issue
      await reportService.putReportsByReportId(firstReport.id, 'no_issue');

      // check getReportsPhotos with filter: pending
      const paginationOption = {
        limit: paginationLimitMap.reports,
        filter: statusMap.pending,
      };

      const getReportsPhotos = await reportService.getReportPhotos(
        paginationOption
      );

      expect(getReportsPhotos.reportPhotos).toHaveLength(1);
      expect(getReportsPhotos.reportPhotos[0].status).toBe('pending');
    });
  });
  describe('with wrong filter', () => {
    it('should show all report ', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        '',
        1,
        1
      );

      // create two test photo data
      const path = 'testPhotoPath';
      const path2 = 'testPhotoPath2';
      const userId = null;
      const reportIp = '0.0.0';
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const firstPhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );
      const secondPhoto = await photoModel.createPhoto(
        path2,
        userId,
        spaceId,
        dateTime
      );

      // create  two report
      const content = '回報測試';
      const reporter = { id: reportIp, type: reporterTypeMap.IP };
      const firstReport = await reportService.postReport(
        firstPhoto.id,
        reporter,
        content
      );
      await reportService.postReport(secondPhoto.id, reporter, content);

      // put first report's status be no_issue
      await reportService.putReportsByReportId(firstReport.id, 'no_issue');

      // check getReportsPhotos with wrong filter word
      const paginationOption = {
        limit: paginationLimitMap.reports,
        filter: 'fakeWord',
      };

      const getReportsPhotos = await reportService.getReportPhotos(
        paginationOption
      );

      expect(getReportsPhotos.reportPhotos).toHaveLength(2);
    });
  });
});
