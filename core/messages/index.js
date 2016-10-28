const Request                   = require('./request');
const Response                  = require('./response');

function Message(req, res){
    this.request = new this.constructor.request(req);
    this.response = new this.constructor.response(res);
}

Message.request = Request;
Message.response = Response;

module.exports = Message;

require('./interceptors');