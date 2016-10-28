const config                    = require('config');
const Factories                 = require('core/factories');


const NotificationSmsFactory = Factories('NotificationSms');

class NotificationSms {

    constructor() {
        this.provider = require(`./providers/${config.smsGate.providers[config.smsGate.active].name}`);
    }

    send({
            accounts_senders_id = null,
            sender_title = 'automatic message',
            body,
            recipient_phone,
            accounts_recipient_id = null,
            type = 'automatic'
        })
    {
        return this.provider.sendSms(recipient_phone, body)
            .then(response => {
                let saveData = {
                    status                  : response.status,
                    accounts_senders_id     : accounts_senders_id,
                    provider_sms_id         : response.providerSmsId,
                    body                    : body,
                    recipient_phone         : recipient_phone,
                    accounts_recipient_id   : accounts_recipient_id,
                    type                    : type,
                    sender_title            : sender_title
                };
                return NotificationSmsFactory
                    .new(saveData)
                    .then((notificationSms) => notificationSms.save());
            });
    }

    getStatus(id) {
        return this.provider.getSmsStatus(id)
            .then(response => NotificationSmsFactory.get({provider_sms_id: id}))
            .then((notificationSms) => {
                notificationSms.status = response[0].status;
                return notificationSms.save();
            });
    }

    getSmsBalance() {
        return this.provider.getSmsBalance();
    }
}

module.exports = NotificationSms;