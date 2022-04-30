const { randomUUID } = require('crypto');

async function tokenGenerator() {
  const token = await randomUUID();
  const result = token;
  return result;
}

module.exports = tokenGenerator;
