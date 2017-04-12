const Factories                 = use('core/factories');
const Errors                    = use('core/errors');


const passwordRecoveryFactory   = Factories('Accounts');
const notificationSMSFactory    = Factories('NotificationSms');


const passwordRecoveryController = {

    path: 'accounts/recovery',

    permissions: {},

    POST : [
        // accounts/recovery
        function () {
            if(!this.request.body.phone_number) {
                throw new Errors.BadRequest("Error: phone number is a required parameter");
            }

            return passwordRecoveryFactory.get({phone_number: this.request.body.phone_number})
                .then((account) => {
                    account.generatePasswordRecoveryToken();
                    return notificationSMSFactory.new({
                        body: `Authorization code: ${account.recovery_token}`,
                        recipientPhone: account.phone_number,
                        accountsRecipientId: account.id
                    }).then(notificationSMS => account);
                })
                .then(account => {
                    account.save();
                    this.response.status = this.response.statuses._201_Created;
                    return '';
                })
        }
    ]
};


module.exports = passwordRecoveryController;