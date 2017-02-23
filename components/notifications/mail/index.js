const config                    = use('config');
const Factories                 = use('core/factories');
const NotificationEmailsFactory = Factories('NotificationEmails');


class NotificationEmails {

    constructor() {
        this.provider = require(`./providers/${config.mailGate.providers[config.mailGate.active].name}`);
    }

    send(options, additionalOptions) {

        let saveData = {
            accounts_senders_id: additionalOptions.sendersId,
            subject: options.subject,
            body: options.html,
            recipient_email_to: options.to,
            recipient_email_cc: options.cc.join(','),
            recipient_email_bcc: options.bcc.join(','),
            accounts_recipients_id: additionalOptions.accountRecipientsId,
            type: additionalOptions.type
        };

        return NotificationEmailsFactory.new(saveData)
            .then((notificationEmail)=> {
                return notificationEmail.save();
            })
            .then((notificationEmail)=> {
                return this.provider.send(options)
                    .then(response => {
                        notificationEmail.message_id = response.messageId;
                        notificationEmail.status = response.status;
                        return notificationEmail.save();
                    });
            });
    }

}

module.exports = NotificationEmails;