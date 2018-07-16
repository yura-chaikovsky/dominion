const Config                        = use('config');
const Errors                        = use('core/errors');
const Property                      = use('core/property');

const NotificationEmailRepository   = require('./repository');
const STATUSES                      = require('./enums/statuses');
const TYPES                         = require('./enums/types');


const NotificationEmailDefinition = {

    name: 'NotificationsEmail',

    repository: NotificationEmailRepository,

    properties: {
        id                      : Property.id(),
        messages_id             : Property.string().max(255),
        provider_type           : Property.string(),
        accounts_senders_id     : Property.id(),
        sender_from             : Property.string().max(255),
        sender_reply_to         : Property.string().max(255),
        subject                 : Property.string().max(255),
        body                    : Property.string().max(64500),
        recipient_to            : Property.object(),
        recipient_cc            : Property.object(),
        recipient_bcc           : Property.object(),
        accounts_recipients_id  : Property.id(),
        status                  : Property.enum(Object.keys(STATUSES)),
        type                    : Property.enum(Object.keys(TYPES))
    },

    factory: {
        STATUSES,
        TYPES,

        new: function (properties = {}, providerConfig = Config.emailGate.providers[Config.emailGate.active]) {
            const newModel = new this.__model__(properties);
            newModel.__unsaved__ = true;
            newModel.provider_type = providerConfig.type;
            newModel.provider = require(`./providers/${providerConfig.type}`);
            newModel.provider.config = providerConfig;
            return Promise.resolve(Object.seal(newModel));
        }
    },

    instance: {

        send() {
            return this.save()
                .then(email => Promise.all([email, email.provider.send({
                        from: this.sender_from,
                        replyTo: this.sender_reply_to,
                        to: this.recipient_to,
                        cc: this.recipient_cc,
                        bcc: this.recipient_bcc,
                        subject: this.subject,
                        html: this.body
                    })])
                )
                .then(([email, response]) => {
                    email.messages_id = response.messageId;
                    email.status = response.status;
                    return email.save();
                })
                .then(email => {
                    if (email.status === STATUSES.FAILED) {
                        throw new Errors.BadRequest("Email was not sent.");
                    }
                    return email;
                });
        },

        fillTemplate(bodyVars, subjectVars = {}) {
            Object.keys(subjectVars).forEach(key => this.subject = this.subject.split(key).join(subjectVars[key]));
            Object.keys(bodyVars).forEach(key => this.body = this.body.split(key).join(bodyVars[key]));
            return this;
        }

    }
};


module.exports = NotificationEmailDefinition;