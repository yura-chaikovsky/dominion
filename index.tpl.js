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