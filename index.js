"use strict";
global.use = function (path) {
    if(path === 'config'){
        return require.main.require('./' + path);
    }else{
        return require('./' + path);
    }
};

const Server                    = use('core/server');
const Message                   = use('core/messages');


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