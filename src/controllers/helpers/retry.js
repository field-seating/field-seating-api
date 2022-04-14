const GeneralError = require('../helpers/general-error');

async function retry(func) {
  let count = 0;
  const maxTries = 3;
  const check = true;
  while (check) {
    try {
      await func;
    } catch (err) {
      // console.log(count);
      count += 1;
      if (count === maxTries)
        throw new GeneralError({
          code: err.status,
          message: err.message,
        });
    }
  }
}

module.exports = retry;
