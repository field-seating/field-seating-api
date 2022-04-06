const prisma = require('../config/prisma');
const GeneralError = require('../controllers/helpers/general-error');
const postRecordErrorMap = require('../errors/post-record-error');
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
      console.log(record);
      const createPhoto = await prisma.photos.create({
        data: {
          userId: record.userId,
          spaceId: record.spaceId,
          recordId: record.id,
          date: record.date,
          path: '00001',
          thumbnail_path: 'm00001',
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
