class GeneralError extends Error {
  constructor({ message, code, httpCode }) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
    this.httpCode = httpCode;
    //Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = GeneralError;
