const prisma = require('../config/prisma');
const GeneralError = require('../errors/error/general-error');
const postRecordErrorMap = require('../errors/post-record-error');

class RecordModel {
  constructor() {}
  async createRecord(filename, userId, spaceId, date) {
    console.log('gore');
    return await prisma.$transaction(async (prisma) => {
      const createRecord = await prisma.records.create({
        data: {
          userId: userId,
          spaceId: spaceId,
          date: date,
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
      const createPhoto = await prisma.photos.create({
        data: {
          userId: record.userId,
          spaceId: record.spaceId,
          recordId: record.id,
          date: record.date,
          path: filename,
          thumbnail_path: `thumb_${filename}`,
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
