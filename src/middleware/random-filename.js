const { randomUUID } = require('crypto');

async function randomFilename() {
  const result = await randomUUID();
  return result;
}

module.exports = randomFilename;
