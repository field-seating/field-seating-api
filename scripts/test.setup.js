const { getClient } = require('../src/config/redis');

afterAll(async () => {
  const client = await getClient();
  await client.disconnect();
});
