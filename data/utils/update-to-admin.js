const UserModel = require('../../src/models/user');
const logger = require('../../src/config/logger');
const { isNil } = require('ramda');

async function updateToAdmin(ownerIds) {
  const userModel = new UserModel();
  ownerIds.forEach(async (ownerId) => {
    logger.info(`update user:${ownerId} to admin`);

    // check userId existed
    const user = await userModel.getUserById(ownerId);

    // if userId is not existed
    if (isNil(user)) {
      return logger.info(`user:${ownerId} not found`);
    }

    // update to admin
    await userModel.updateToAdmin(user.id);
    logger.info(`success update user:${user.email} to admin`);
  });
}

module.exports = updateToAdmin;
