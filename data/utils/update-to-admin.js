const UserModel = require('../../src/models/user');
const logger = require('../../src/config/logger');
const { isNil } = require('ramda');

async function updateToAdmin(ownerId) {
  const userModel = new UserModel();
  ownerId.forEach(async (owner) => {
    logger.info(`update user:${owner} to admin`);

    // check userId existed
    const user = await userModel.getUserById(owner);

    // if userId is not existed
    if (isNil(user)) {
      return logger.info(`user:${owner} not found`);
    }

    // update to admin
    await userModel.updateToAdmin(user.id);
    logger.info(`success update user:${user.email} to admin`);
  });
}

module.exports = updateToAdmin;
