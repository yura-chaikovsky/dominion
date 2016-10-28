module.exports = {
    models: [
        'components/permissions/model'
    ],
    controllers: [
        'components/permissions/controller'
    ],
    requestInterceptors: [
        'components/permissions/interceptors/requestCheckPermission'
    ],
    responseInterceptors: []
};