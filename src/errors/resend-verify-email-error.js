const resendVerifyEmailErrorMap = {
  duplicateSend: {
    message: '尚未超過可重新寄送之時間，請稍候！',
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
