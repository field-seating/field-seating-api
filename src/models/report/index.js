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
  async getReportsByPhotoIdAndUserId(photoId, userId) {
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
  async getReportsPhotos({ limit }) {
    const reportPhotos = await prisma.reports.findMany({
      take: limit,
      where: {},
      select: {
        id: true,
        userId: true,
        status: true,
        content: true,
        createdAt: true,
        photoId: true,
        photo: {
          select: {
            id: true,
            path: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = {
      data: reportPhotos,
      cursorId: null,
    };
    return result;
  }
  async getReportByReportId(reportId) {
    const report = await prisma.reports.findUnique({
      where: {
        id: reportId,
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
  async putPendingReports(photoId, status) {
    const putReports = await prisma.reports.updateMany({
      where: {
        photoId: photoId,
        status: 'pending',
      },
      data: {
        status: status,
      },
    });
    return putReports;
  }
  async _truncate() {
    await prisma.reports.deleteMany({});
  }
}

module.exports = ReportModel;
