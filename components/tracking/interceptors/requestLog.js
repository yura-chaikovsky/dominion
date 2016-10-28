const Crypto                    = require('crypto');
const Factories                 = require('core/factories');


function requestInterceptorLogging() {

    const LogsFactory = Factories('Logs');

    return new Promise((resolve, reject) => {
        LogsFactory.new({
                tracking_id: this.request.tracking.id,
                header: JSON.stringify(this.request.headers),
                body: JSON.stringify(this.request.body)
            }, false)
        .then(log => log.save())
        .then(resolve)
        .catch(reject);
    });
}

module.exports = requestInterceptorLogging;