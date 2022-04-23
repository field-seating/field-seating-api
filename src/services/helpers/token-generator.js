const { randomUUID } = require('crypto');

async function tokenGenerator() {
  const token = await randomUUID();
  return token;
}

module.exports = tokenGenerator;
