const resendVerifyEmailErrorMap = {
  flushFailed: {
    message: 'token更新失敗',
    code: 'rs001',
  },
  alreadyVerified: {
    message: '帳號已經開通',
    code: 'rs002',
  },
  inactive: {
    message: '帳號已遭封鎖',
    code: 'rs003',
  },
};

module.exports = resendVerifyEmailErrorMap;
