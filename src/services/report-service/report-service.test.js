const assert = require('assert/strict');
const { isEmpty } = require('ramda');
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
const { statusMap } = require('../../models/report/constant');

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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const newReport = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      // create first time
      await reportService.postReport(newPhoto.id, content, reporter);
      // create again
      await reportService.postReport(newPhoto.id, content, reporter);
      //create again and again (to check only one data in DB)
      const newReport = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );

      expect(newReport).toHaveLength(1); //to check only one data in DB
      expect(newReport[0].photoId).toBe(newPhoto.id);
      expect(newReport[0].userId).toBe(userId);
      expect(newReport[0].content).toBe(content);
      expect(newReport[0].status).toBe(statusMap.pending);
    });
  });

  describe('with not existed photo', () => {
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      await assert.rejects(
        async () => {
          await reportService.postReport(fakePhotoId, content, reporter);
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const newReport = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );

      expect(newReport.photoId).toBe(newPhoto.id);
      expect(newReport.userId).toBe(userId);
      expect(newReport.content).toBe(content);
      expect(newReport.status).toBe(statusMap.pending);
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const report = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );
      await reportService.postReport(newPhoto.id, content, reporter);

      // put report by status: deleted
      const putReports = await reportService.putReportsByReportId(
        report.id,
        'deleted'
      );

      // data check photo was deleted
      const deletedPhoto = await photoModel.getPhoto(newPhoto.id);
      const photoDeleted = isEmpty(deletedPhoto);

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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const report = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );
      await reportService.postReport(newPhoto.id, content, reporter);

      // put report by status: deleted
      const putReports = await reportService.putReportsByReportId(
        report.id,
        'no_issue'
      );

      // data check photo was not deleted
      const reportPhoto = await photoModel.getPhoto(newPhoto.id);

      expect(putReports.count).toBe(2);
      expect(reportPhoto[0].id).toBe(newPhoto.id);
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const report = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );
      await reportService.postReport(newPhoto.id, content, reporter);

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
  describe('with not exist reportId', () => {
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
      const reporter = {
        ip: '0.0.0',
        userId: userId,
      };
      const report = await reportService.postReport(
        newPhoto.id,
        content,
        reporter
      );

      // put report
      await reportService.postReport(newPhoto.id, content, reporter);

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
