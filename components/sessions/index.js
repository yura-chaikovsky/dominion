module.exports = {
    factories: [
        __dirname + '/factory'
    ],
    controllers: [
        __dirname + '/controller'
    ],
    requestInterceptors: [
        __dirname + '/interceptors/checkAuthInterceptor'
    ],
    responseInterceptors: []
};
