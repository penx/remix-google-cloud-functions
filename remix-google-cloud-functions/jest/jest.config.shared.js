const ignorePatterns = [
  "\\/build\\/",
  "\\/coverage\\/",
  "\\/\\.vscode\\/",
  "\\/\\.tmp\\/",
  "\\/\\.cache\\/",
];
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: "node",
  modulePathIgnorePatterns: ignorePatterns,
  watchPathIgnorePatterns: [...ignorePatterns, "\\/node_modules\\/"],
  testMatch: ["<rootDir>/**/*-test.[jt]s?(x)"],
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  transform: {
    "\\.[jt]sx?$": require.resolve("./transform"),
  },
};
