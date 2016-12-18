const Http                      = require('http');
const Controllers               = require('./controllers');
const Factories                 = require('./factories');
const Messages                  = require('./messages');
const Router                    = require('./router');

let Server = function () {
    if (!new.target) throw new Error('Server can not be called without creating instance.');

    this.componentsModules = {
        requestInterceptors: new Set(),
        responseInterceptors: new Set(),
        controllers: new Set(),
        factories: new Set()
    };

    this.router = Router;
    this.factories = Factories;
    this.controllers = Controllers;
    this.addComponent = addComponent;
    this.start = startServer;
    this.clear = clear;
    this.stop = stopServer;
};

const startServer = function (config) {

    componentsRegistration.call(this);

    this.server = Http.createServer(this.router.handle);

    this.server.listen(config.server.port, config.server.host, () => {
        console.log(`Server running at http://${config.server.host}:${config.server.port}/`);
    });
};

const clear = function () {
    Router.clear();
    Factories.clear();
    Controllers.clear();
};

const stopServer = function () {
    clear();
    this.server.close();
};

const addComponent = function (componentInfo) {
    Object.keys(componentInfo).forEach(
        type => componentInfo[type].forEach(
            path => this.componentsModules[type].add(path)
        ));
};

const componentsRegistration = function () {
    this.componentsModules.factories.forEach(model=> {
        this.factories.define(require(model));
    });

    this.componentsModules.requestInterceptors.forEach(interceptor => {
        Messages.request.addInterceptor(require(interceptor));
    });

    this.componentsModules.responseInterceptors.forEach(interceptor => {
        Messages.response.addInterceptor(require(interceptor));
    });

    this.componentsModules.controllers.forEach(controller=> {
        this.controllers.define(require(controller));
    });

};

module.exports = Server;