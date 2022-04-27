const passwordErrorMap = {
  emailInvalid: {
    message: '無合法電子信箱',
    code: 'P001',
  },
  tokenInvalid: {
    message: '非有效連結',
    code: 'P002',
  },
  newPasswordRequired: {
    message: '密碼為必填欄位',
    code: 'P003',
  },
  newPasswordLength: {
    message: '密碼長度為8 至20',
    code: 'P004',
  },
};

module.exports = passwordErrorMap;
