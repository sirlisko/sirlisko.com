module.exports = {
    "extends": [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:jest/recommended",
        "standard"
    ],
    "plugins": [
        "jest",
        "standard",
        "promise"
    ],
    "env": {
        "browser": true,
        "jest/globals": true
    }
};
