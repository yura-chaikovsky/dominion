module.exports = {
    models: [
        __dirname + '/model'
    ],
    controllers: [],
    requestInterceptors: [
        __dirname + '/interceptors/requestTracking'
    ],
    responseInterceptors: []
};
