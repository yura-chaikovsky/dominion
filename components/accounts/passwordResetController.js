const Factories                 = require('core/factories');
const Errors                    = require('core/errors');


const AccountsFactory = Factories('Accounts');

const passwordResetController = {

    path: 'accounts/password-reset',

    permissions: {},

    POST : [
        // accounts/password-reset
        function () {
            if(!this.request.body.phone_number){
                throw new Errors.BadRequest("Error: phone_number is a required parameter");
            }

            if(!this.request.body.recovery_token) {
                throw new Errors.BadRequest("Error: recovery_token is a required parameter");
            }
            
            return AccountsFactory.get({phone_number: this.request.body.phone_number, recovery_token: this.request.body.recovery_token})
                .then((account)=> {
                    account.createPasswordHash(this.request.body.password);
                    account.recovery_token = null;
                    return account.save();
                });
        }
    ]
};


module.exports = passwordResetController;