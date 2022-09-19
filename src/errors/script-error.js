const scriptErrorMap = {
  needFieldNameParameter: {
    message: '需要於指令後方輸入field參數 ex: --field=XinZhuang',
    code: 'scr01',
  },
  fieldNotFound: {
    message: '沒有這座球場的space資訊',
    code: 'scr02',
  },
};

module.exports = scriptErrorMap;
