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

    static sendSms(phoneNumber, messageText){

        let options = {
            url: config.smsGate.providers[config.smsGate.active].sendSmsUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey      : config.smsGate.providers[config.smsGate.active].token,
                recipient   : phoneNumber,
                text        : messageText,
                from        : config.smsGate.providers[config.smsGate.active].senderName,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {

                try {
                    let response = JSON.parse(result);
                    if(response.code===0) {
                        return {
                            providerSmsId   : response.data.messageId,
                            status          : SMS_STATUSES['NEW']
                        };
                    } else {
                        throw new Errors.Fatal(`SMS: ${response.message}`);
                    }

                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }

            });
    }

    static getSmsStatus(ids){

        let options = {
            url: config.smsGate.providers[config.smsGate.active].getStatusUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey: config.smsGate.providers[config.smsGate.active].token,
                ids: ids,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {
                try {
                    let resultJson = JSON.parse(result);
                    if(resultJson.code===0) {
                        let response = [];
                        resultJson.data.forEach(item => {
                            response.push({
                                providerSmsId   : item.id,
                                status          : MOBIZONE_STATUSES[item.status]
                            });
                        });
                        return response;
                    } else {
                        throw new Errors.BadRequest(`SMS: ${resultJson.message}`);
                    }

                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }
            });

    }

    static getSmsBalance(){

        let options = {
            url: config.smsGate.providers[config.smsGate.active].getBalanceUrl,
            method: 'POST',
            postBody: querystring.stringify({
                apiKey: config.smsGate.providers[config.smsGate.active].token
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return HttpRequest.request(options)
            .then(result => {
                try {
                    let response = JSON.parse(result);
                    if(response.code===0) {
                        return {
                            balance : response.balance,
                            currency: response.currency
                        };
                    } else {
                        throw new Errors.Fatal(`SMS: ${response.message}`);
                    }
                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }
            });
    }
}


module.exports = MobizonNetUa;