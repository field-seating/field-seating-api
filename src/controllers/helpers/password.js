const bcrypt = require('bcryptjs');

// hash
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
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
