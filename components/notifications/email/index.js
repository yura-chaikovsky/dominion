const config                    = use('config');
const Factories                 = use('core/factories');


const NotificationEmailsFactory = Factories('NotificationEmails');

class NotificationEmails {

    constructor() {
        this.provider = require(`./providers/${config.mailGate.providers[config.mailGate.active].name}`);
    }

    send({
        from = '',
        to = [],
        cc = [],
        bcc = [],
        subject = '',
        body = '',
        accountSendersId = null,
        accountRecipientsId = null,
        type = NotificationEmailsFactory.EMAIL_TYPE.AUTOMATIC
    }) {

        let saveData = {
            accounts_senders_id: accountSendersId,
            subject: subject,
            body: body,
            recipient_email_to: to.join(','),
            recipient_email_cc: cc.join(','),
            recipient_email_bcc: bcc.join(','),
            accounts_recipients_id: accountRecipientsId,
            type: type
        };

        return NotificationEmailsFactory.new(saveData)
            .then((notificationEmail) => {
                return notificationEmail.save();
            })
            .then((notificationEmail) => {
                return this.provider.send({ from, to, cc, bcc, subject, body })
                    .then(response => {
                        notificationEmail.message_id = response.messageId;
                        notificationEmail.status = response.status;
                        return notificationEmail.save();
                    });
            });
    }
}


module.exports = NotificationEmails;