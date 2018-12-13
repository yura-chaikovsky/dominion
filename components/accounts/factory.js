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

    factory: {
        getByToken(token) {
            if (!token.trim()) {
                throw new Errors.Unauthorized("Access token is missing");
            }
            return this.repo.getByToken(token)
                .then(rows => {
                    if (rows.length) {
                        return this.new(rows[0], false);
                    } else {
                        throw new Errors.Unauthorized();
                    }
                });
        }
    },

    instance: {
        confirmOwner(session) {
            if (!(session.rootOwner === true
                || this.id === session.accounts.id)) {
                throw new Errors.Forbidden("You don't have permission to perform this action");
            }

            return this;
        },

        checkPassword(password) {
            if (this.password == createHash(password, this.salt)) {
                return this;
            } else {
                throw new Errors.Unauthorized();
            }
        },

        setPassword(password) {
            let [passwordHash, salt] = encodePassword(password);
            this.populate({password: passwordHash, salt});
            return this;
        }
    }
};


module.exports = AccountsDefinition;