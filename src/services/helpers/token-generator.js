const { randomString } = require('../../utils/crypto/random');

async function tokenGenerator() {
  const token = await randomString(16);
  const result = token;
  return result;
}

module.exports = tokenGenerator;
