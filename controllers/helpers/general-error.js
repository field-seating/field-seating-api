class generalError extends Error {
  constructor({ message, code }) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = generalError;
