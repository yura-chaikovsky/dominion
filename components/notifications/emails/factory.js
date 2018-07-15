const Config                        = use('config');
const Property                      = use('core/property');

const NotificationEmailRepository   = require('./repository');
const EMAIL_STATUSES                = require('./enums/statuses');
const EMAIL_TYPES                   = require('./enums/types');


const NotificationEmailDefinition = {

    name: 'NotificationsEmails',

    repository: NotificationEmailRepository,

    properties: {
        id                      : Property.id(),
        messages_id             : Property.string().max(255),
        provider_name           : Property.string(),
        accounts_senders_id     : Property.id(),
        sender_from             : Property.string().max(255),
        sender_reply_to         : Property.string().max(255),
        subject                 : Property.string().max(255),
        body                    : Property.string().max(64500),
        recipient_to            : Property.object(),
        recipient_cc            : Property.object(),
        recipient_bcc           : Property.object(),
        accounts_recipients_id  : Property.id(),
        status                  : Property.enum(Object.keys(EMAIL_STATUSES)),
        type                    : Property.enum(Object.keys(EMAIL_TYPES))
    },

    factory: {
        EMAIL_STATUSES,
        EMAIL_TYPES,

        new: function (properties = {}, providerConfig = Config.emailGate.providers[Config.emailGate.active]) {
            const newModel = new this.__model__(properties);
            newModel.provider = require(`./providers/${providerConfig.type}`);
            newModel.provider.config = providerConfig;

            return Promise.resolve(Object.freeze(newModel));
        }
    },

    instance: {

        send() {
            return this.save()
                .then(notificationEmail => {
                    return notificationEmail.provider.send({
                        from: this.sender_from,
                        replyTo: this.sender_reply_to,
                        to: this.recipient_to,
                        cc: this.recipient_cc,
                        bcc: this.recipient_bcc,
                        subject: this.subject,
                        html: this.body
                    });
                })
                .then(response => {
                    this.messages_id = response.messagesId;
                    this.status = response.status;
                    return this.save();
                });
        }

    }
};


module.exports = NotificationEmailDefinition;