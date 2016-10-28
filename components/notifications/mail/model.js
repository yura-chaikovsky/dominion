const Property = require('core/property');
const NotificationEmailRepository = require('./repository');

const NotificationEmailDefinition = {

    name: 'NotificationEmails',

    repository: NotificationEmailRepository,

    properties: {

        id: Property.id(),
        message_id: Property.string().max(255),
        senders_id: Property.number(),
        subject: Property.string().max(30),
        body: Property.string().max(64500),
        recipient_email_to: Property.string().max(100),
        recipient_email_cc: Property.string().max(255),
        recipient_email_bcc: Property.string().max(255),
        recipient_id: Property.number(),
        account_recipients_id: Property.number(),
        status: Property.enum('QUEUED', 'SENT', 'REJECTED', 'ACCEPTED'),
        type: Property.enum('AUTOMATIC', 'MANUAL')
    },

    factory: {},

    instance: {}
};


module.exports = NotificationEmailDefinition;