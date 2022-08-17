const prisma = require('../../config/prisma');
const { statusMap } = require('./constant');

class ReportModel {
  async createReport(photoId, content, userId = null) {
    const newReport = await prisma.reports.create({
      data: {
        userId: userId,
        photoId: photoId,
        status: statusMap.pending,
        content: content,
      },
      select: {
        id: true,
        userId: true,
        photoId: true,
        status: true,
        content: true,
        createdAt: true,
      },
    });
    return newReport;
  }
  async getReport(photoId, userId) {
    const report = await prisma.reports.findMany({
      where: {
        photoId: photoId,
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        photoId: true,
        status: true,
        content: true,
        createdAt: true,
      },
    });
    return report;
  }
}

module.exports = ReportModel;
