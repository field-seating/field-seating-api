const alwaysThrow = (err) => () => {
  throw err;
};

module.exports = alwaysThrow;
