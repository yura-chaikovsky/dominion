const Factories                 = use('core/factories');


function requestInterceptorLogging() {

    const LogsFactory = Factories('Logs');

    return new Promise((resolve, reject) => {
        LogsFactory.new({
                tracking_id: this.request.tracking.id || null,
                header: JSON.stringify(this.request.headers),
                body: JSON.stringify(this.request.body)
            }, false)
        .then(log => log.save())
        .then(resolve)
        .catch(reject);
    });
}

module.exports = requestInterceptorLogging;