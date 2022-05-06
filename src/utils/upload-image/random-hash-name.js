const { randomString } = require('../../utils/crypto/random');
const { hashPassword } = require('../../utils/crypto/password');

async function randomHashName(name, randomLength) {
  // random word
  const randomWord = await randomString(randomLength);
  // combine with name
  const randomFilename = `${name}${randomWord}`;
  // hash it
  const hashFilename = await hashPassword(randomFilename, 2);
  // avoid slash
  const result = hashFilename.replace(/\//g, 'slash');
  return result;
}

module.exports = {
  randomHashName,
};
