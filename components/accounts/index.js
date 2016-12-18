module.exports = {
    factories: [
        __dirname + '/factory'
    ],
    controllers: [
        __dirname + '/controller',
        __dirname + '/passwordRecoveryController',
        __dirname + '/passwordResetController'
    ],
    requestInterceptors: [],
    responseInterceptors: []
};
