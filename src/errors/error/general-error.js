class GeneralError extends Error {
  constructor({ message, code, httpCode }) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
    this.httpCode = httpCode;
  }
}

module.exports = GeneralError;
