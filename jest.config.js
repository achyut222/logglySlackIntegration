module.exports = {
    verbose: true,
    rootDir: './',
    collectCoverage: true,
    collectCoverageFrom: [
        "*.{js,jsx}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!index.test.js",
        "!jest.config.js"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["lcov"]
};