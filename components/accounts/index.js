module.exports = {
    models: [
        'components/accounts/model'
    ],
    controllers: [
        'components/accounts/controller',
        'components/accounts/passwordRecoveryController',
        'components/accounts/passwordResetController'
    ],
    requestInterceptors: [],
    responseInterceptors: []
};
