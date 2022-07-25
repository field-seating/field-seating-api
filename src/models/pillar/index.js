const prisma = require('../../config/prisma');

class PillarModel {
  constructor() {}
  async _truncate() {
    await prisma.pillars.deleteMany({});
  }
}

module.exports = PillarModel;
