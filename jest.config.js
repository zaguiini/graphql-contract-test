module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./setup-matchers.js"],
  moduleFileExtensions: ["js", "graphql"],
  transform: {
    "^.+\\.graphql$": "./parse-graphql-file.js",
  },
  collectCoverage: true,
  collectCoverageFrom: ["./queries/**/*.graphql"],
  coverageReporters: ["text"],
  coverageThreshold: {
    global: {
      statements: 100,
    },
  },
};
