module.exports = {
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      console.log(err);
      res.status(401).json({
        status: 'error',
        code: `${err.code}`,
        message: `${err.message}`,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`,
      });
    }
    next(err);
  },
};
