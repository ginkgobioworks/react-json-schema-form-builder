module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/example/"],
  setupFiles: ["./src/jestShim.ts"],
  setupFilesAfterEnv: ["./src/setupTests.ts"], 
  transform: {
      "\\.[jt]sx?$": "babel-jest"
  },
  collectCoverageFrom: [
    "src/**/*.ts*",
  ],
  coverageReporters: [
    "text",
    "lcov"
  ],
};
