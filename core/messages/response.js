const Statuses                  = require('./statuses');

function Response(res){
    this._serverResponse = res;
    this._response = {
        status: this.statuses._200_OK,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: ""
    };
}

const responsePrototype = {
    get status (){
        return this._response.status;
    },
    set status (newStatus){
        this._response.status = newStatus;
    },
    get headers (){
        return this._response.headers;
    },
    set body (newBody) {
        this._response.body = newBody;
    },

    send: function(){
        Object.keys(this._response.headers).forEach((headerName) => {
            this._serverResponse.setHeader(headerName, this._response.headers[headerName]);
        });

        this._serverResponse.statusCode = this._response.status.code;
        this._serverResponse.statusMessage = this._response.status.message;

        this._serverResponse.end(this._response.status.emptyBody? '' : JSON.stringify(this._response.body));
    },

    statuses: Statuses
};

Object.getOwnPropertyNames(responsePrototype).forEach(function(propertyName){
    Object.defineProperty(Response.prototype, propertyName, Object.getOwnPropertyDescriptor(responsePrototype, propertyName));
});


/*** Response interceptors ***/
const interceptorsSet = new Set();

Response.addInterceptor = function (interceptorFunction){
    interceptorsSet.add(interceptorFunction);
};

Response.getInterceptors = function (){
    return interceptorsSet;
};


module.exports = Response;