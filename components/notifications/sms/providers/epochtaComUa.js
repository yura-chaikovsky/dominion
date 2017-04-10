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

/*
    ---CONFIG TEMPLATE---
     {
        name            : 'EpochtaComUa'
        senderName      : 'Info',
        publicKey       : 'public key',
        privateKey      : 'private key',
        apiUrl          : 'http://api.myatompark.com/sms/3.0/'
     }
*/


    static get config(){
        return this._config;
    }

    static set config(config){
        this._config = config;
    }

    static sendSms(phoneNumber, messageText) {

         let args = {
            version: '3.0',
            action: 'sendSMS',
            key: this.config.publicKey,
            sender: 'Info',
            text: messageText,
            phone: phoneNumber,
            datetime: '',
            sms_lifetime: 0,
        };

        args.sum = this._generateSig(args, this.config.privateKey);

        let options = {
            url:  `${this.config.apiUrl + args.action}?${querystring.stringify(args)}`
        };

        return HttpRequest.request(options)
            .then(result => {

                let response = JSON.parse(result);
                if (!response.result) {
                    throw new Errors.Fatal(`SMS: ${response.error}`);
                }

                return {
                    providerSmsId: response.result.id,
                    status: SMS_STATUSES['NEW']
                };

            })
            .catch((error) => {
                if (error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
                }
            });

    }

    static getSmsStatus(id) {

        let args = {
            version: '3.0',
            action: 'getCampaignInfo',
            key: this.config.publicKey,
            id: id
        };

        args.sum = this._generateSig(args, this.config.privateKey);

        let options = {
            url:  `${this.config.apiUrl + args.action}?${querystring.stringify(args)}`
        };

        return HttpRequest.request(options)
            .then(result => {

                let response = JSON.parse(result);
                if(!response.result) {
                    throw new Errors.Fatal(`SMS: ${response.error}`);
                }

                return {
                    providerSmsId: id,
                    status: PROVIDER_STATUSES[response.result.status]
                };

            })
            .catch((error) => {
                if(error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
                }
            });
    }

    static getSmsBalance() {

        let args = {
            version: '3.0',
            action: 'getUserBalance',
            key: this.config.publicKey,
            cy: 'UAH'
        };

        args.sum = this._generateSig(args, this.config.privateKey);

        let options = {
            url:  `${this.config.apiUrl + args.action}?${querystring.stringify(args)}`
        };

        return HttpRequest.request(options)
            .then(result => {

                let response = JSON.parse(result);

                if (!response.result) {
                    throw new Errors.BadRequest(`SMS: ${response.error}`);
                }

                return {
                    balance: response.result.balance_currency,
                    currency: response.result.currency
                };

            })
            .catch((error) => {
                if(error instanceof SyntaxError) {
                    throw new Errors.BadRequest(`The remote server respond invalid JSON. Data: (${error})`);
                } else {
                    throw new Errors.BadRequest(error);
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