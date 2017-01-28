const Http                      = require('http');
const Controllers               = require('./controllers');
const Factories                 = require('./factories');
const Messages                  = require('./messages');
const Router                    = require('./router');
const Errors                    = require('./errors');

let Server = function () {
    if (!new.target) throw new Errors.Fatal('Server can not be called without creating instance.');

    this.componentsModules = {
        requestInterceptors: new Set(),
        responseInterceptors: new Set(),
        controllers: new Set(),
        factories: new Set(),
        bootstrap: new Set()
    };

    this.router = Router;
    this.factories = Factories;
    this.controllers = Controllers;
    this.addComponent = addComponent;
    this.start = startServer;
    this.stop = stopServer;
};

const startServer = function (config) {

    componentsRegistration.call(this);

    this.server = Http.createServer(this.router.handle);

    this.server.listen(config.server.port, config.server.host, () => {
        componentsBootstraping.call(this);
        console.log(`Server running at http://${config.server.host}:${config.server.port}/`);
    });
};

const stopServer = function () {
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

const componentsBootstraping = function () {
    this.componentsModules.bootstrap.forEach(controller => {
        const bootstrapFn = require(controller);
        (typeof bootstrapFn === 'function') && bootstrapFn(this);
    });
};

module.exports = Server;