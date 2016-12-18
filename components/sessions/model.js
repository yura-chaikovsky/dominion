const Property                  = use('core/property');
const Config                    = use('config');

const SessionsRepository        = require('./repository');
const Tools                     = require('./tools');


const statuses = {
    ACTIVE: "ACTIVE",
    LONG_ACTIVE: "LONG_ACTIVE",
    CLOSED: "CLOSED"
};
const closeTypes = {
    LOG_OUT: "LOG_OUT",
    AFTER_VALIDATION: "AFTER_VALIDATION",
    FULL_LOG_OUT: "FULL_LOG_OUT",
    ON_SCHEDULE: "ON_SCHEDULE"
};


const SessionsDefinition = {

    name: 'Sessions',

    repository: SessionsRepository,

    properties: {
        id: Property.id(),
        accounts_id: Property.model("Accounts"),
        creation_time: Property.number(),
        expiration_time: Property.number(),
        close_time: Property.number(),
        close_type: Property.enum(...Object.keys(closeTypes)),
        ip: Property.string(),
        status: Property.enum(...Object.keys(statuses)),
        user_agent: Property.string(),
        token: Property.string()
    },

    factory: {
        statuses,

        closeTypes,

        create: function (account, options) {
            let session = new this.__model__({accounts_id: account.id});
            session.creation_time = new Date();

            if (options.rememberMe) {
                session.expiration_time = new Date(+session.creation_time + Config.session.persistentTtl);
                session.status = this.statuses.LONG_ACTIVE;
            }
            else {
                session.expiration_time = new Date(+session.creation_time + Config.session.regularTtl);
                session.status = this.statuses.ACTIVE;
            }

            session.close_time = null;
            session.ip = options.ip;
            session.token = Tools.sha256(session.creation_time + session.accounts_id);
            return Promise.resolve(Object.freeze(session));
        },

        closeAll: function (session) {
            this.find({accounts_id: session.accounts_id})
            .then(sessions => {
                sessions.filter(element => {
                    if (element.token !== session.token) {
                        return element;
                    }
                }).forEach(element => {
                    element.close();
                })
            })
        }
    },

    instance: {
        close: function (closeType) {
            this.close_time = new Date();
            this.close_type = closeType;
            this.status = statuses.CLOSED;

            this.save();
        },

        refresh: function (options) {
            switch (this.status) {
                case statuses.LONG_ACTIVE:
                    this.expiration_time = new Date(+new Date() + Config.session.persistentTtl);
                    break;
                case statuses.ACTIVE:
                    this.expiration_time = new Date(+new Date() + Config.session.regularTtl);
                    break;
            }

            this.ip = options.ip;
            this.save();
        },

        isActive(){
            if ((this.status === statuses.LONG_ACTIVE || this.status === statuses.ACTIVE)
                && this.expiration_time > new Date()) {
                return true;
            }

            return false;
        }
    }
};


module.exports = SessionsDefinition;