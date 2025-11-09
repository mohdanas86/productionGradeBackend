export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  verbose: true,
};
