module.exports = {
    models: [
        __dirname + '/model'
    ],
    controllers: [
        __dirname + '/controller'
    ],
    requestInterceptors: [
        __dirname + '/interceptors/requestCheckPermission'
    ],
    responseInterceptors: []
};