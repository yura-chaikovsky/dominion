const Factories                 = use('core/factories');


function requestInterceptorLogging() {

    const LogsFactory = Factories('Logs');

    return LogsFactory.new({
        tracking_id: (this.request.tracking && this.request.tracking.id) || null,
        header: JSON.stringify(this.request.headers),
        body: JSON.stringify(this.request.body)
    })
        .then(log => log.save());
}

module.exports = requestInterceptorLogging;