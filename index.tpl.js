const Server                    = require('dominion');
const Config                    = use('config');


Server.addComponent(require('./components/sessions'));
Server.addComponent(require('./components/permissions'));
Server.addComponent(require('./components/accounts'));
Server.addComponent(require('./components/tracking'));
Server.addComponent(require('./components/logging'));
Server.addComponent(require('./components/authorize'));
Server.addComponent(require('./components/notifications'));
Server.addComponent(require('./components/media'));

Server.addComponent(require('./components/favorites'));


Server.start(Config);

/* *** OpenAPI documentation ***
const fs = require("fs");
const openAPIJSON = Server.openApiJSON({
    "title": "Awesome APIs",
    "description": "Awesome APIs",
    "version": "1.0.0",
    "contact": {
        "email": "yura.chaikovsky@gmail.com"
    }
});
fs.writeFileSync("<filePath>", JSON.stringify(openAPIJSON, null, 4));
*/