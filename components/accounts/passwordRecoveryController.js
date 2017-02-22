const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const Sms                       = require('../notifications/sms/index');


const passwordRecoveryFactory = Factories('Accounts');

const passwordRecoveryController = {

    path: 'accounts/recovery',

    permissions: {},

    POST : [
        // accounts/recovery
        function () {
            if(this.request.body.phone_number){
                return passwordRecoveryFactory.get({phone_number: this.request.body.phone_number})
                    .then((account)=> {
                        account.generatePasswordRecoveryToken();
                        let sms = new Sms();
                        return sms.send({
                            body: `Code : ${account.recovery_token}`,
                            recipientPhone: account.phone_number,
                            accountsRecipientId: account.id
                        }).then(response=>{
                            account.save();
                            this.response.status = this.response.statuses._201_Created;
                            return '';
                        });
                    });

            } else {
                throw new Errors.BadRequest("Error: phone number is a required parameter");
            }
        }
    ]
};


module.exports = passwordRecoveryController;