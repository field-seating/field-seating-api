const signUpErrorMap = {
  duplicateEmail: {
    message: '信箱已經註冊過了！',
    code: 's001',
  },
  emailRequired: {
    message: '信箱為必填欄位！',
    code: 's002',
  },
  nameRequired: {
    message: '名字為必填欄位！',
    code: 's003',
  },
  passwordRequired: {
    message: '密碼為必填欄位',
    code: 's004',
  },
  passwordLength: {
    message: '密碼長度為8 至20',
    code: 's005',
  },
  emailFormat: {
    message: 'Email 格式不符合',
    code: 's006',
  },
};

module.exports = signUpErrorMap;
