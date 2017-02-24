const Property                      = use('core/property');

const NotificationEmailRepository   = require('./repository');

const EMAIL_STATUS                  = require('./mailStatuses');

const EMAIL_TYPE = {
    AUTOMATIC:'AUTOMATIC',
    MANUAL:'MANUAL'
};


const NotificationEmailDefinition = {

    name: 'NotificationEmails',

    repository: NotificationEmailRepository,

    properties: {
        id: Property.id(),
        message_id: Property.string().max(255),
        accounts_senders_id: Property.number(),
        subject: Property.string().max(30),
        body: Property.string().max(64500),
        recipient_email_to: Property.string().max(100),
        recipient_email_cc: Property.string().max(255),
        recipient_email_bcc: Property.string().max(255),
        accounts_recipients_id: Property.number(),
        account_recipients_id: Property.number(),
        status: Property.enum(Object.keys(EMAIL_STATUS)),
        type: Property.enum(Object.keys(EMAIL_TYPE))
    },

    factory: {
        EMAIL_STATUS,
        EMAIL_TYPE

    },

    instance: {}
};


module.exports = NotificationEmailDefinition;