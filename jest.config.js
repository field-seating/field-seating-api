module.exports = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/src/**/__tests__/**/*.[jt]s?(x)',
    '**/src/**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  testTimeout: 10000,
  //An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/scripts/test-setup.js'],
};
