const prisma = require('../../config/prisma');

class AisleModel {
  constructor() {}
  async _truncate() {
    await prisma.aisles.deleteMany({});
  }
}

module.exports = AisleModel;
