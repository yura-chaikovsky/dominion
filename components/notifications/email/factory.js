const Config                        = use('config');
const Property                      = use('core/property');

const NotificationEmailRepository   = require('./repository');
const EMAIL_STATUS                  = require('./enums/statuses');
const EMAIL_TYPE                    = require('./enums/types');


const NotificationEmailDefinition = {

    name: 'NotificationsEmail',

    repository: NotificationEmailRepository,

    properties: {
        id                      : Property.id(),
        message_id              : Property.string().max(255),
        provider_name           : Property.string(),
        accounts_senders_id     : Property.id(),
        sender_email            : Property.string().max(255),
        subject                 : Property.string().max(255),
        body                    : Property.string().max(64500),
        recipient_email_to      : Property.object(),
        recipient_email_cc      : Property.object(),
        recipient_email_bcc     : Property.object(),
        accounts_recipients_id  : Property.id(),
        status                  : Property.enum(Object.keys(EMAIL_STATUS)),
        type                    : Property.enum(Object.keys(EMAIL_TYPE))
    },

    factory: {
        EMAIL_STATUS,
        EMAIL_TYPE,

        new: function (properties = {}, providerConfig = Config.emailGate.providers[Config.emailGate.active]) {
            const newModel = new this.__model__(properties);
            newModel.providerConfig = providerConfig;
            newModel.provider_name = newModel.providerConfig.name;
            newModel.provider = require(`./providers/${newModel.provider_name}`);
            newModel.provider.config = newModel.providerConfig;

            return Promise.resolve(Object.freeze(newModel));
        }
    },

    instance: {

        send() {
            return this.save()
                .then((notificationEmail) => {
                    return this.provider.send(
                        this.sender_email,
                        this.recipient_email_to,
                        this.recipient_email_cc,
                        this.recipient_email_bcc,
                        this.subject,
                        this.body
                    );
                })
                .then(response => {
                    this.message_id = response.messageId;
                    this.status = response.status;
                    return this.save();
                });
        }

    }
};


module.exports = NotificationEmailDefinition;