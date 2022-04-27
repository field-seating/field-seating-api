const { randomUUID } = require('crypto');

async function tokenGenerator() {
  const token = await randomUUID();
  const date = new Date();
  const result = {
    token,
    date,
  };
  return result;
}

module.exports = tokenGenerator;
