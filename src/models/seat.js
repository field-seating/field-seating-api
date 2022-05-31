const prisma = require('../config/prisma');

class SeatModel {
  constructor() {}
  async _truncate() {
    await prisma.seats.deleteMany({});
  }
}

module.exports = SeatModel;
