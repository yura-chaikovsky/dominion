module.exports = {
    factories: [],
    controllers: [],
    requestInterceptors: [
        __dirname + '/interceptors/requestAddCORSHeader'
    ],
    responseInterceptors: [
        __dirname + '/interceptors/responseAdd200Status'
    ]
};
