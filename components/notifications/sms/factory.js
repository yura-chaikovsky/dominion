const Property                      = use('core/property');

const NotificationSmsRepository     = require('./repository');
const NotificationSmsStatuses       = require('./smsStatuses');


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
        status                  : Property.enum(...Object.keys(NotificationSmsStatuses)),
        type                    : Property.enum('automatic','manual'),
        price_internal          : Property.number().price(),
        price_external          : Property.number().price()
    },

    factory: {},

    instance: {}
};


module.exports = NotificationSmsDefinition;