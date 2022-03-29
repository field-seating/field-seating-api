const httpStatus = require('http-status');

class ExtendableError extends Error {
  constructor(message, status, code) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

class signUpError1 extends ExtendableError {
  constructor(
    message = '信箱已經註冊過了！',
    status = httpStatus.NOT_FOUND,
    isPublic = true,
    code = '001'
  ) {
    super(message, status, isPublic, code);
    this.name = 'signUpError1';
  }
}
class signUpError2 extends ExtendableError {
  constructor(
    message = '信箱為必填欄位！',
    status = httpStatus.NOT_FOUND,
    isPublic = true,
    code = '002'
  ) {
    super(message, status, isPublic, code);
    this.name = 'signUpError2';
  }
}

module.exports = {
  signUpError1,
  signUpError2,
};
