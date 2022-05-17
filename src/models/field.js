const prisma = require('../config/prisma');

class FieldModel {
  constructor() {}
  async createField(name, img) {
    const createField = await prisma.fields.create({
      data: {
        name,
        img,
      },
      select: {
        id: true,
        name: true,
        img: true,
      },
    });
    return createField;
  }
  async _truncate() {
    await prisma.fields.deleteMany({});
  }
}

module.exports = FieldModel;
