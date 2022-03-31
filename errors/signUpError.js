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
};

module.exports = signUpErrorMap;
