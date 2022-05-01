const verifyErrorMap = {
  invalidToken: {
    message: '無效的連結，請重新申請',
    code: 't001',
  },
  updateFailed: {
    message: '使用者狀態更新失敗',
    code: 't002',
  },
  expiredToken: {
    message: '連結已過期，請重新申請',
    code: 't003',
  },
};

module.exports = verifyErrorMap;
