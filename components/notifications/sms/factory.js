const Property                      = use('core/property');

const NotificationSmsRepository     = require('./repository');
const SMS_STATUS                    = require('./enums/statuses');
const SMS_TYPE                      = require('./enums/types');


const NotificationSmsDefinition = {

    name: 'NotificationSms',

    repository: NotificationSmsRepository,

    properties: {
        id                      : Property.id(),
        accounts_senders_id     : Property.number(),
        provider_sms_id         : Property.number(),
        sender_title            : Property.string().max(30),
        body                    : Property.string().max(255),
        recipient_phone         : Property.number(),
        accounts_recipient_id   : Property.number(),
        time_sent               : Property.number(),
        time_received           : Property.number(),
        time_failed             : Property.number(),
        status                  : Property.enum(Object.keys(SMS_STATUS)),
        type                    : Property.enum(Object.keys(SMS_TYPE)),
        price_internal          : Property.number().price(),
        price_external          : Property.number().price()
    },

    factory: {
        SMS_STATUS,
        SMS_TYPE
    },

    instance: {

        setProviderConfig: function (providerConfig){
            this.providerConfig = providerConfig;
        },

        setProvider: function (){
            this.provider = require(`./providers/${this.providerConfig.name}`);
            this.provider.config(this.providerConfig);
        },

        send: function ({ body, recipientPhone }) {
            return this.provider.sendSms(recipientPhone, body)
                .then(response => {
                    this.status = response.status;
                    this.provider_sms_id = response.providerSmsId;
                    return this;
                });
        },

        getStatus: function(){
            return this.provider.getSmsStatus(this.id)
                .then((response) => {
                    this.status = response.status;
                    return this;
                });
        }

    }
};


module.exports = NotificationSmsDefinition;