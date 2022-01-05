module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/example/"],
  setupFilesAfterEnv: ["./src/setupTests.js"], 
  transform: {
      "\\.[jt]sx?$": "babel-jest"
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js"
  ],
  coverageReporters: [
    "text",
    "lcov"
  ],
};
