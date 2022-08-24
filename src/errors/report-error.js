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
};

module.exports = reportErrorMap;
