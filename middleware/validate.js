const generalError = require('../controllers/helpers/general-error');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (err) {
    const validationError = new generalError({
      message: `[${err.errors.join(', ')}]`,
      code: '001',
    });
    next(validationError);
  }
};

module.exports = validate;
