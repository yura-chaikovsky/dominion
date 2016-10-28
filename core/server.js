const Http                      = require('http');
const Router                    = require('core/router');
const Factories                 = require('core/factories');
const Controllers               = require('core/controllers');
const Messages                  = require('core/messages');

let Server = function () {
    if (!new.target) throw new Error('Server can not be called without creating instance.');

    this.componentsModules = {
        requestInterceptors: new Set(),
        responseInterceptors: new Set(),
        controllers: new Set(),
        models: new Set()
    };

    this.router = Router;
    this.models = Factories;
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
    this.componentsModules.models.forEach(model=> {
        this.models.define(require(model));
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

    return checkPermissionsInDb.call(this);
};

function checkPermissionsInDb() {
    let permissions = require('components/permissions/permissions');
    return permissions.checkRequiredPermissions(collectPermissions(this));
}

function addPermissionsInDb(){
    let PermissionFactory = Factories('Permissions');
    collectPermissions(this).forEach(permission=>{
        PermissionFactory.new({title: permission})
            .then(permission => permission.save());
    });
}

function collectPermissions(server){
    let permissionList = [];
    let controllersList = Array.from(server.controllers.getControllersCollection().entries()).map(([key, value]) => value);
    controllersList.forEach(controller => controller.forEach(handler =>
    {
        if (handler.permission){
            permissionList.push(handler.permission);
        }
    }));
    return permissionList;
}

module.exports = Server;