module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/example/"],
  setupFiles: ["./src/jestShim.js"],
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
