const Errors                    = require('./../errors');
const Router                    = require('./../router');
const getHandlersDefinitions    = require('./handlersDefinitions');

const controllersCollection = new Map();

const Controllers = () => {};

Controllers.define = function(controller){
    if(!controller.path) {
        throw new Errors.Fatal(`Property 'path' is missing in controller`);
    }else if(controllersCollection.has(controller.path)){
        throw new Errors.Fatal(`Controller with path '${controller.path}' is already defined`);
    }else{
        controllersCollection.set(controller.path, getHandlersDefinitions(controller));
    }
    return Router.addRoutes(controllersCollection.get(controller.path));
};

Controllers.clear = function(){
    controllersCollection.clear();
};

Controllers.getControllersCollection = function () {
    return controllersCollection;
};

module.exports = Controllers;