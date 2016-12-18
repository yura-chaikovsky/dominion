"use strict";
global.use = function (path) {
    if(path === 'config'){
        return require.main.require('./' + path);
    }else{
        return require('./' + path);
    }
};

const Dominion                  = use('core/server');
const Message                   = use('core/messages');

const Server = new Dominion();

Server.addComponent(require('./components/sessions'));
Server.addComponent(require('./components/permissions'));
Server.addComponent(require('./components/accounts'));
Server.addComponent(require('./components/tracking'));
Server.addComponent(require('./components/logging'));
Server.addComponent(require('./components/authorize'));
Server.addComponent(require('./components/notifications'));
Server.addComponent(require('./components/media'));


Message.request.addInterceptor(function requestInterceptorLogConsole(){
    console.log('-> Request interceptor to: ' + this.request.path);
});

Message.response.addInterceptor(function responseInterceptorLogConsole(body){
    console.log('<- Response interceptor from: ' + this.request.path);
    return body;
});

Message.response.addInterceptor(function responseInterceptorAddServerNameHeader(body){
    this.response.headers['Server'] = 'Dominion';
    return body;
});


module.exports = Server;
//server.start(config);