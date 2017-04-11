const Factories                 = use('core/factories');
const Config                    = use('config');


const NotificationSmsFactory = Factories('NotificationSms');

class NotificationSms {

    constructor(providerConfig) {
        NotificationSmsFactory.setProviderConfig(providerConfig);
        NotificationSmsFactory.setProvider(providerConfig);
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
                return notificationSms.send(notificationSms.recipient_phone, body);
            })
            .then((notificationSms)=>{
                return notificationSms.save();                
            });
    }

    getStatus() {
        return NotificationSmsFactory.getStatus()
            .then((notificationSms) => {
                return notificationSms.save();
            });
    }
    
}

module.exports = NotificationSms;