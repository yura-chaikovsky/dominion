const Property                  = use('core/property');
const Errors                    = use('core/errors');

const AccountsRepository        = require('./repository');
const ROLES                     = require('./enums/roles');
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

        ROLES,

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
            if (session && (session.rootOwner === true || this.id === session.account.id)) {
                return this;
            } else {
                throw new Errors.Forbidden("You don't have permission to perform this action");
            }
        },

        checkPassword(password) {
            if (this.password_hash == Tools.createHash(password, this.password_salt)) {
                return this;
            } else {
                throw new Errors.Unauthorized("Incorrect credentials");
            }
        },

        setPassword(password) {
            let [password_hash, password_salt] = Tools.encodePassword(password);
            this.populate({password_hash, password_salt});
            return this;
        }
    }
};


module.exports = AccountsDefinition;