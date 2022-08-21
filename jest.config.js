module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  testEnvironmentOptions: {
    url: "http://localhost",
  },
};
