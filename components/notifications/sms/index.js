const Factories                 = use('core/factories');
const Config                    = use('config');


const NotificationSmsFactory = Factories('NotificationSms');

class NotificationSms {

    constructor() {
        this.provider = require(`./providers/${Config.smsGate.providers[Config.smsGate.active].name}`);
    }

    send({
        accountsSendersId = null,
        senderTitle = 'automatic message',
        body,
        recipientPhone,
        accountsRecipientId = null,
        type = 'AUTOMATIC'
    })
    {
        let saveData = {
            accounts_senders_id     : accountsSendersId,
            body                    : body,
            recipient_phone         : recipientPhone,
            accounts_recipient_id   : accountsRecipientId,
            type                    : type,
            sender_title            : senderTitle
        };

        return NotificationSmsFactory.new(saveData)
            .then((notificationSms) => {
                return notificationSms.save();
            })
            .then((notificationSms)=>{
                return this.provider.sendSms(notificationSms.recipient_phone, body)
                    .then(response => {
                        notificationSms.status = response.status;
                        notificationSms.provider_sms_id = response.providerSmsId;
                        return notificationSms.save();
                    });
            });
    }

    getStatus(id) {
        return this.provider.getSmsStatus(id)
            .then(response => NotificationSmsFactory.get({provider_sms_id: id}))
            .then((notificationSms) => {
                notificationSms.status = response.status;
                return notificationSms.save();
            });
    }

    getSmsBalance() {
        return this.provider.getSmsBalance();
    }
}

module.exports = NotificationSms;
