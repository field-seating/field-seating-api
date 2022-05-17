const { randomString } = require('../../utils/crypto/random');
const { hashPassword } = require('../../utils/crypto/password');

async function randomHashName(reqId, randomLength) {
  // random word
  const randomWord = await randomString(randomLength);
  // combine with name
  const randomFilename = `${reqId}${randomWord}`;
  // hash it
  const hashFilename = await hashPassword(randomFilename, 2);
  // avoid slash
  const result = hashFilename.replace(/\//g, 'slash');
  return result;
}

module.exports = {
  randomHashName,
};
