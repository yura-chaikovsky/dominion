module.exports = {
    models: [
        __dirname + '/model'
    ],
    controllers: [
        __dirname + '/controller',
        __dirname + '/passwordRecoveryController',
        __dirname + '/passwordResetController'
    ],
    requestInterceptors: [],
    responseInterceptors: []
};
