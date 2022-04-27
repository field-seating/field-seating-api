const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();
  const duration = after - before;

  logger.info(`Query ${params.model}.${params.action}`, {
    type: 'db_query',
    model: params.model,
    action: params.action,
    duration,
  });

  return result;
});

module.exports = prisma;
