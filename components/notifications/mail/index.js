const config = require('config');
const Factories = require('core/factories');
const NotificationEmailsFactory = Factories('NotificationEmails');

class NotificationEmails {

    constructor() {
        this.provider = require(`./providers/${config.mailGate.providers[config.mailGate.active].name}`);
    }

    send(options, additional_options) {

        return this.provider.send(options)
            .then(response => {

                let saveData = {
                    message_id: response.resolve.messageId,
                    accounts_senders_id: additional_options.senders_id,
                    subject: options.subject,
                    body: options.html,
                    recipient_email_to: options.to,
                    recipient_email_cc: options.cc.toString(),
                    recipient_email_bcc: options.bcc.toString(),
                    accounts_recipients_id: additional_options.account_recipients_id,
                    status: response.status,
                    type: additional_options.type
                };
                return NotificationEmailsFactory.new(saveData)
            })

            .then(mail => mail.save());

    }

}

module.exports = NotificationEmails;
