async function withRetry(func, options) {
  const { maxTries } = options ? options : { maxTries: 1 };
  let count = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await func();
    } catch (err) {
      count += 1;
      if (count === maxTries) throw err;
    }
  }
}

module.exports = withRetry;
