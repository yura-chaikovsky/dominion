const Config                        = use('config');
const Property                      = use('core/property');

const NotificationSmsRepository     = require('./repository');
const SMS_STATUS                    = require('./enums/statuses');
const SMS_TYPE                      = require('./enums/types');


const NotificationSmsDefinition = {

    name: 'NotificationsSms',

    repository: NotificationSmsRepository,

    properties: {
        id                      : Property.id(),
        message_id              : Property.string().max(255),
        accounts_senders_id     : Property.id(),
        provider_name           : Property.string(),
        sender_title            : Property.string().max(30),
        body                    : Property.string().max(255),
        recipient_phone         : Property.number(),
        accounts_recipient_id   : Property.id(),
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
        SMS_TYPE,

        new: function (properties = {}, providerConfig = Config.smsGate.providers[Config.smsGate.active]) {
            const newModel = new this.__model__(properties);
            newModel.providerConfig = providerConfig;
            newModel.provider_name = newModel.providerConfig.name;
            newModel.provider = require(`./providers/${newModel.provider_name}`);
            newModel.provider.config(newModel.providerConfig);

            return Promise.resolve(Object.freeze(newModel));
        }

    },

    instance: {

        send: function () {
            return this.save()
                .then(() => this.provider.sendSms(this.recipient_phone, this.body))
                .then(response => {
                    this.status = response.status;
                    this.message_id = response.providerSmsId;
                    return this.save();
                });
        },

        getStatus: function() {
            return this.provider.getSmsStatus(this.message_id)
                .then((response) => {
                    this.status = response.status;
                    return this.save();
                });
        }

    }
};


module.exports = NotificationSmsDefinition;