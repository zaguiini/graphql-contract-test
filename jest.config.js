module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["queries/*.graphql"],
  setupFilesAfterEnv: ["./setup-matchers"],
  coverageReporters: ["text"],
  transform: {
    "^.+\\.graphql$": "./parse-graphql-file",
  },
};
