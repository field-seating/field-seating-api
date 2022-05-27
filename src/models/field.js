const prisma = require('../config/prisma');

class FieldModel {
  constructor() {}
  async createField(name, img) {
    const newField = await prisma.fields.create({
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
    return newField;
  }
  async getFieldByName(name) {
    const field = await prisma.fields.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return field;
  }
  async _truncate() {
    await prisma.fields.deleteMany({});
  }
}

module.exports = FieldModel;
