const UserModel = require('../../src/models/user');
const logger = require('../../src/config/logger');
const { isNil } = require('ramda');

async function updateToAdmin(userId) {
  logger.info(`update user:${userId} to admin`);

  const userModel = new UserModel();
  // check userId existed
  const user = await userModel.getUserById(userId);
  if (!isNil(user)) {
    // update to admin
    await userModel.updateToAdmin(user.id);
    logger.info(`success update user:${user.email} to admin`);
  }
  // if userId is not existed
  logger.info(`user:${userId} not found`);
}

module.exports = updateToAdmin;
