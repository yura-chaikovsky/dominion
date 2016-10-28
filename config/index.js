switch (process.env.NODE_ENV) {
    case ('prod'):
        module.exports = require('./config.prod');
        break;
    case ('test'):
        module.exports = require('./config.test');
        break;
    default:
        module.exports = require('./config.dev');
}