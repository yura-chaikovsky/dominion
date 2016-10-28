"use strict";

let Dominion                    = require('core/server');
let config                      = require('config');

var server = new Dominion();


server.addComponent(require('components/sessions'));
server.addComponent(require('components/permissions'));
server.addComponent(require('components/accounts'));
server.addComponent(require('components/tracking'));
server.addComponent(require('components/authorize'));
server.addComponent(require('components/notifications'));
server.addComponent(require('components/media'));


const Message = require('core/messages');

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


server.start(config);