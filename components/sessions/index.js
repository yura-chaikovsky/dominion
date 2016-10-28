module.exports = {
    models: [
        'components/sessions/model'
    ],
    controllers: [],
    requestInterceptors: [
        'components/sessions/interceptors/requestAuth'
    ],
    responseInterceptors: []
};
