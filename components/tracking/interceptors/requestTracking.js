const Factories                 = use('core/factories');

const Crypto                    = require('crypto');


function requestInterceptorTracking() {
    const TrackingFactory = Factories('Tracking');

    return new Promise((resolve, reject) => {

        TrackingFactory.new({
            url: this.request.path,
            method: this.request.method,
            referrer: this.request.headers['referrer'],
            accounts_id: this.request.session ? this.request.session.account.id : null,
            tracking_token: this.request.cookies.tracking_token || generateAndSetInCookiesTrackingToken(this),
            access_token: this.request.headers['access-token'],
            user_agent: this.request.headers['user-agent'],
            ip: this.request.ip
        })
        .then(track => track.save())
        .then(track => {
            this.request.tracking = track;
        })
        .then(resolve)
        .catch(reject);

    });
}

function generateAndSetInCookiesTrackingToken(message) {
    let trackingToken = generateTrackingToken(message.request.headers['user-agent']);
    message.response.headers['Set-Cookie'] = `tracking_token=${trackingToken}; Expires=Fri, 01 Jan 2049 00:00:00 GMT;`;
    return trackingToken;
}

function generateTrackingToken(userAgent) {
    //ToDo: Fix algorithm that will send same trackingId for couple simultaneous requests from the same user
    let text = "" + Math.round(new Date().getTime() / 1000 / 60) + userAgent;
    let buf = Crypto.createHash('sha256').update(text).digest('hex');
    return buf.toString('hex');
}

module.exports = requestInterceptorTracking;