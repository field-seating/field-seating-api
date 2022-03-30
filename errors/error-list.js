const errorMap = {
  signUpError: [
    {
      message: '信箱已經註冊過了！',
      code: 's001',
    },
    {
      message: '信箱為必填欄位！',
      code: 's002',
    },
    {
      message: '名字為必填欄位！',
      code: 's003',
    },
    {
      message: '密碼為必填欄位',
      code: 's004',
    },
  ],
};

module.exports = errorMap;
