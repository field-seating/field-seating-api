const { getClient } = require('../src/config/redis');
const prisma = require('../src/config/prisma');

afterEach(async () => {
  const client = await getClient();
  await client.sendCommand(['FLUSHALL']);
});

afterAll(async () => {
  const client = await getClient();
  await client.disconnect();
  prisma.$disconnect();
});
