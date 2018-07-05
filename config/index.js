let config,
    env = {"production": false, "test": false, "development": false};

switch (process.env.NODE_ENV) {
    case ("production"):
        config = require("./config.prod");
        env.production = true;
        break;
    case ("test"):
        config = require("./config.test");
        env.test = true;
        break;
    default:
        config = require("./config.dev");
        env.development = true;
}

config.env = env;
module.exports = config;