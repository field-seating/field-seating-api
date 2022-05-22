const bcrypt = require('bcryptjs');

// hash
async function hashPassword(password, salt) {
  return await bcrypt.hash(password, salt);
}

// compare
async function comparePassword(input, database) {
  const isMatch = await bcrypt.compare(input, database);
  return isMatch;
}

module.exports = {
  hashPassword,
  comparePassword,
};
