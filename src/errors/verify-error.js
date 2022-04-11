const verifyErrorMap = {
  invalidToken: {
    message: '無效的連結，請重新申請',
    code: 't001',
  },
  expiredToken: {
    message: '此連結已經過期，請重新申請',
    code: 't002',
  },
};

module.exports = verifyErrorMap;
