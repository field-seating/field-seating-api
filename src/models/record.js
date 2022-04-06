const prisma = require('../config/prisma');
const GeneralError = require('../controllers/helpers/general-error');
const postRecordErrorMap = require('../errors/post-record-error');
const PhotoModel = require('../models/photo');
const generatePath = require('../controllers/helpers/path-generator');

class RecordModel {
  constructor() {}
  async createRecord(userId, spaceId, dateTime) {
    return await prisma.$transaction(async (prisma) => {
      const createRecord = await prisma.records.create({
        data: {
          userId: userId,
          spaceId: spaceId,
          date: dateTime,
        },
        select: {
          id: true,
          userId: true,
          spaceId: true,
          date: true,
        },
      });
      if (!createRecord) {
        throw new GeneralError(postRecordErrorMap['failInPostRecord']);
      }
      const record = createRecord;
      const photoModel = new PhotoModel();
      const latestPhoto = await photoModel.getLatestPhoto(record.spaceId);
      let newPath = '';
      let newThumbnail_path = '';
      if (!latestPhoto) {
        newPath = `${spaceId}-00001`;
        newThumbnail_path = `${spaceId}-00001`;
      } else {
        let { path, thumbnail_path } = latestPhoto;
        path = path.slice(path.indexOf('-') + 1);
        thumbnail_path = thumbnail_path.slice(thumbnail_path.indexOf('-') + 1);
        console.log(path);
        console.log(thumbnail_path);
        newPath = `${spaceId}-${generatePath(parseInt(path) + 1)}`;
        newThumbnail_path = `${spaceId}-${generatePath(
          parseInt(thumbnail_path) + 1
        )}`;
      }
      const createPhoto = await prisma.photos.create({
        data: {
          userId: record.userId,
          spaceId: record.spaceId,
          recordId: record.id,
          date: record.date,
          path: newPath,
          thumbnail_path: newThumbnail_path,
        },
        select: {
          id: true,
          userId: true,
          spaceId: true,
          recordId: true,
          date: true,
          path: true,
          thumbnail_path: true,
        },
      });
      const result = {
        ...createRecord,
        photo: createPhoto,
      };
      console.log(result);
      return result;
    });
  }
}

module.exports = RecordModel;
