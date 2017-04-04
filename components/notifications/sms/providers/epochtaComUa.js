const querystring               = require('querystring');
const crypto                    = require('crypto');
const config                    = use('config');
const Errors                    = use('core/errors');
const HttpRequest               = use('components/transports');
const SMS_STATUSES              = require('./../enums/statuses');


const PROVIDER_STATUSES = {
    '0'     : SMS_STATUSES['ENQUEUED'],
    '1'     : SMS_STATUSES['REJECTED'],
    '2'     : SMS_STATUSES['ENQUEUED'],
    '3'     : SMS_STATUSES['DELIVERED'],
    '4'     : SMS_STATUSES['REJECTED'],
    '5'     : SMS_STATUSES['PARTLY_DELIVERED'],
    '6'     : SMS_STATUSES['REJECTED'],
    '7'     : SMS_STATUSES['REJECTED'],
    '8'     : SMS_STATUSES['NEW'],
    '9'     : SMS_STATUSES['NEW'],
    '10'    : SMS_STATUSES['ENQUEUED']
};

class EpochtaComUa {

    //DOCUMENTATION: https://www.epochta.com.ua/products/sms/v3.php

    static sendSms(phoneNumber, messageText, providerConfig = null) {
        let gateConfig = providerConfig ? providerConfig:config.smsGate.providers[config.smsGate.active];

        let args = {
            version: '3.0',
            action: 'sendSMS',
            key: gateConfig.publicKey,
            sender: 'Info',
            text: messageText,
            phone: phoneNumber,
            datetime: '',
            sms_lifetime: 0,
        };

        args.sum = this._generateSig(args, gateConfig.privateKey);

        let options = {
            url: [
                gateConfig.apiUrl + args.action,
                querystring.stringify(args)
            ].join('?')
        };

        return HttpRequest.request(options)
            .then(result => {
                try {
                    let response = JSON.parse(result);
                    if(response.result) {
                        return {
                            providerSmsId   : response.result.id,
                            status          : SMS_STATUSES['NEW']
                        };
                    } else {
                        throw new Errors.Fatal(`SMS: ${response.error}`);
                    }
                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }
            });

    }

    static getSmsStatus(id, providerConfig = null) {
        let gateConfig = providerConfig ? providerConfig:config.smsGate.providers[config.smsGate.active];

        let args = {
            version: '3.0',
            action: 'getCampaignInfo',
            key: gateConfig.publicKey,
            id: id
        };

        args.sum = this._generateSig(args, gateConfig.privateKey);

        let options = {
            url: [
                gateConfig.apiUrl + args.action,
                querystring.stringify(args)
            ].join('?')
        };

        return HttpRequest.request(options)
            .then(result => {
                try {
                    let response = JSON.parse(result);
                    if(response.result) {

                        return [{
                            providerSmsId : id,
                            status: PROVIDER_STATUSES[response.result.status]
                        }];

                    } else {
                        throw new Errors.Fatal(`SMS: ${response.error}`);
                    }
                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }
            });
    }

    static getSmsBalance(providerConfig = null) {
        let gateConfig = providerConfig ? providerConfig:config.smsGate.providers[config.smsGate.active];

        let args = {
            version: '3.0',
            action: 'getUserBalance',
            key: gateConfig.publicKey,
            cy: 'UAH'
        };

        args.sum = this._generateSig(args, gateConfig.privateKey);

        let options = {
            url: [
                gateConfig.apiUrl + args.action,
                querystring.stringify(args)
            ].join('?')
        };

        return HttpRequest.request(options)
            .then(result => {
                try {
                    let response = JSON.parse(result);
                    if(response.result) {
                        return {
                            balance : response.result.balance_currency,
                            currency: response.result.currency
                        };
                    } else {
                        throw new Errors.Fatal(`SMS: ${response.error}`);
                    }
                }
                catch (error){
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${result})`);
                }
            });

    }

    static _generateSig(args, privateKey) {
        let concat  = '';
        Object.keys(args)
            .sort()
            .forEach((key)=>{
                concat  += args[key];
            });
        concat += privateKey;
        return crypto.createHash('md5').update(concat).digest("hex");
    }

}

module.exports = EpochtaComUa;