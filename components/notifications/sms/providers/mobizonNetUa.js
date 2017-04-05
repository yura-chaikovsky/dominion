const querystring                 = require('querystring');
const config                      = use('config');
const Errors                      = use('core/errors');
const HttpRequest                 = use('components/transports');
const SMS_STATUSES                 = require('./../enums/statuses');


const MOBIZONE_STATUSES = {
    "NEW" : SMS_STATUSES.NEW,
    "ENQUEUD" : SMS_STATUSES.ENQUEUED,
    "ACCEPTD" : SMS_STATUSES.ACCEPTED,
    "UNDELIV" : SMS_STATUSES.UNDELIVERED,
    "REJECTD" : SMS_STATUSES.REJECTED,
    "PDLIVRD" : SMS_STATUSES.PARTLY_DELIVERED,
    "DELIVRD" : SMS_STATUSES.DELIVERED,
    "EXPIRED" : SMS_STATUSES.EXPIRED,
    "DELETED" : SMS_STATUSES.DELETED
};

class MobizonNetUa {

    //https://mobizon.net.ua
    //http://docs.mobizon.com/api/

    static sendSms(phoneNumber, messageText, providerConfig){

        let options = {
            url: providerConfig.sendSmsUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey      : providerConfig.token,
                recipient   : phoneNumber,
                text        : messageText,
                from        : providerConfig.senderName,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {
                let response = JSON.parse(result);
                if (response.code === 0) {
                    return {
                        providerSmsId: response.data.messageId,
                        status: SMS_STATUSES['NEW']
                    };
                } else {
                    throw new Errors.Fatal(`SMS: ${response.message}`);
                }

            })
            .catch((error) => {
                if (error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
                }
            });
    }

    static getSmsStatus(id, providerConfig){

        let options = {
            url: providerConfig.getStatusUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey: providerConfig.token,
                ids: id,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {

                let resultJson = JSON.parse(result);
                if (resultJson.code === 0) {
                    return {
                        providerSmsId: resultJson.data[0].id,
                        status: MOBIZONE_STATUSES[item.status]
                    };

                } else {
                    throw new Errors.BadRequest(`SMS: ${resultJson.message}`);
                }

            })
            .catch((error) => {
                if (error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
                }
            });

    }

    static getSmsBalance(providerConfig){

        let options = {
            url: providerConfig.getBalanceUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey: providerConfig.token
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {
                let response = JSON.parse(result);
                if (response.code === 0) {
                    return {
                        balance: response.balance,
                        currency: response.currency
                    };
                } else {
                    throw new Errors.Fatal(`SMS: ${response.message}`);
                }
            })
            .catch((error) => {
                if (error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
                }
            });
    }
}


module.exports = MobizonNetUa;