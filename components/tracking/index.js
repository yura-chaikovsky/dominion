module.exports = {
    models: [
        'components/tracking/model',
        'components/tracking/logs/model'
    ],
    controllers: [],
    requestInterceptors: [
        'components/tracking/interceptors/requestTracking',
        'components/tracking/interceptors/requestLog'
    ],
    responseInterceptors: []
};
