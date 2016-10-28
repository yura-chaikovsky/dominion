let config                      = require('config');
let icedfrisby                  = require('firedfrisby');
let joi                         = require('joi');


icedfrisby.globalSetup({
    request: {
        baseUri: `http://${config.server.host}:${config.server.port}`,
        json: true,
        inspectOnFailure: true
    },
    timeout: 1000
});

global.ACCESS_TOKEN = '39966858ef335404b46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3';
global.ACCESS_TOKEN_WITHOUT_PERMISSIONS = '72458462ef335404b46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3';
global.frisby = icedfrisby;
global.joi = joi;