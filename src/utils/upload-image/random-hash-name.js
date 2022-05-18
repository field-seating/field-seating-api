const { randomString } = require('../../utils/crypto/random');
const { hashString } = require('../../utils/crypto/hash');

async function randomHashName(reqId, randomLength) {
  // random word
  const randomWord = await randomString(randomLength);
  // combine with name
  const randomFilename = `${reqId}${randomWord}`;
  // hash it
  const hashFilename = await hashString(randomFilename);
  // avoid slash
  const result = hashFilename.replace(/\//g, 'slash');
  return result;
}

module.exports = {
  randomHashName,
};
