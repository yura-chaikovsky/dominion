module.exports = {
    factories: [
        __dirname + '/factory'
    ],
    controllers: [],
    requestInterceptors: [
        __dirname + '/interceptors/requestTracking'
    ],
    responseInterceptors: []
};
