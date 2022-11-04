const UserModel = require('../../src/models/user');
const logger = require('../../src/config/logger');
const { isNil } = require('ramda');

async function updateToAdmin(ownerIds) {
  const userModel = new UserModel();
  // way 1
  // await Promise.all(
  //   ownerIds.map(async (ownerId) => {
  //     console.log('go');
  //     logger.info(`update user:${ownerId} to admin`);

  //     // check userId existed
  //     const user = await userModel.getUserById(ownerId);
  //     console.log(user);
  //     // if userId is not existed
  //     if (isNil(user)) {
  //       console.log('noId');
  //       return logger.info(`user:${ownerId} not found`);
  //     }

  //     // update to admin
  //     await userModel.updateToAdmin(user.id);
  //     logger.info(`success update user:${user.email} to admin`);
  //   })
  // );

  // way 2

  const result = ownerIds.map(async (ownerId) => {
    console.log(ownerId);
    logger.info(`update user:${ownerId} to admin`);

    // check userId existed
    const user = await userModel.getUserById(ownerId);
    console.log(user);
    // if userId is not existed
    if (isNil(user)) {
      console.log('noId');
      return logger.info(`user:${ownerId} not found`);
    }

    // update to admin
    await userModel.updateToAdmin(user.id);

    return logger.info(`success update user:${user.email} to admin`);
  });

  await Promise.all(result);

  // way 3
  // for (const ownerId of ownerIds) {
  //   console.log(ownerId);
  //   logger.info(`update user:${ownerId} to admin`);

  //   // check userId existed
  //   const user = await userModel.getUserById(ownerId);

  //   // if userId is not existed
  //   if (isNil(user)) {
  //     return logger.info(`user:${ownerId} not found`);
  //   }

  //   // update to admin
  //   await userModel.updateToAdmin(user.id);
  //   logger.info(`success update user:${user.email} to admin`);
  // }

  // way 4

  console.log('end');
}

module.exports = updateToAdmin;
