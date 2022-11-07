const updateToAdmin = require('./utils/update-to-admin');

const ownerIds = [1, 2];

async function main() {
  await updateToAdmin(ownerIds);
}

main();
