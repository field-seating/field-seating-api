const GeneralError = require('../errors/error/general-error');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (err) {
    const isGeneralError = err instanceof GeneralError;

    if (isGeneralError) {
      next(err);
      return;
    }

    const validationError = new GeneralError({
      message: `[${err.errors.join(', ')}]`,
      code: '001',
    });
    next(validationError);
  }
};

module.exports = validate;
