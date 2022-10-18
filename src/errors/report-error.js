const reportErrorMap = {
  wrongPhotoId: {
    message: '此照片不存在',
    code: 'rp001',
  },
  exceedLimitError: {
    message: '您已超出單日回報問題上限',
    code: 'rp002',
  },
  duplicateError: {
    message: '您已回報過此張照片',
    code: 'rp003',
  },
  wrongReportId: {
    message: '此回報不存在',
    code: 'rp004',
  },
  reportAlreadyResolve: {
    message: '此回報已結案',
    code: 'rp005',
  },
  reporterDoesNotExist: {
    message: '沒有回報者資訊',
    code: 'rp006',
  },
  wrongReporterType: {
    message: '回報者資訊類別錯誤',
    code: 'rp007',
  },
  wrongReportStatusType: {
    message: '篩選不存在的狀態',
    code: 'rp008',
  },
};

module.exports = reportErrorMap;
