const crypto = require('crypto');

const hashString = async (name) => {
  const result = await crypto.createHash('sha256').update(name).digest('hex');
  return result;
};

module.exports = { hashString };
