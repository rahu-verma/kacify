/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFiles: ["<rootDir>/src/tests/setupFile.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupFileAfterEnv.ts"],
};
