const Property                  = use('core/property');

const AccountsRepository        = require('./repository');
const Tools                     = require('./tools');


const AccountsDefinition = {

    name: 'Accounts',

    repository: AccountsRepository,

    properties: {
        id: Property.id(),
        phone_number: Property.number().min(10000000000).max(999999999999),
        email: Property.string().max(50),
        password_hash: Property.string().max(255).private(),
        password_salt: Property.string().max(255).private(),
        info: Property.object(),
        recovery_token: Property.string().private()
    },

    factory: {},

    instance: {

        checkPassword: function(password){
            return this.password_hash == Tools.generatePassword(password, this.password_salt) ? true:false;
        },

        createPasswordHash: function (password){
            if(typeof password!=='undefined') {
                this.password_salt = Tools.generateSalt();
                this.password_hash = Tools.generatePassword(password, this.password_salt);
            }
        },

        generatePasswordRecoveryToken: function () {
            this.recovery_token = Tools.generateRecoveryToken();
        }
    }
};


module.exports = AccountsDefinition;