const Config                    = use("config");
const Property                  = use("core/property");
const crypto                    = require("crypto");
const generateToken             = require("./tools/generateToken");
const SessionsRepository        = require("./repository");

const STATES                    = require("./enums/states");
const SLIDING                   = require("./enums/sliding");

const SessionsDefinition = {

    name: "Sessions",

    repository: SessionsRepository,

    properties: {
        id                      : Property.id().private(),
        token                   : Property.string(),
        state                   : Property.enum(Object.keys(STATES)).private(),
        accounts_id              : Property.model("Accounts"),
        issueTime               : Property.date().private(),
        ttl                     : Property.number().min(1000).private(),
        sliding                 : Property.enum(['0', '1']).private(),
        signExpirationTime      : Property.date(),
        tokenExpirationTime     : Property.date(),
        revokeTime              : Property.date().private(),
        footprint               : Property.string().private(),
        userAgent               : Property.string().private(),
        ip                      : Property.string().max(15).private()
    },

    factory: {
        STATES,
        SLIDING,

        createForAccount(account) {
            return this.new({
                account_id: account.id,
                token: generateToken(account.id),
                activity_time: new Date()
            });
        },

        issue(sessionData) {
            const NOW = new Date();
            const ttl = sessionData.ttl || Config.session.regularTtl;

            return this.new({
                token: generateToken(sessionData.account.id),
                state: this.STATES.ACTIVE,
                accounts_id: sessionData.account.id,
                issueTime: NOW,
                ttl: ttl,
                sliding: sessionData.sliding,
                signExpirationTime: sessionData.signed ? new Date(+NOW + Math.min(Config.session.signTtl, ttl)) : null,
                tokenExpirationTime: new Date(+NOW + ttl),
                footprint: this._footprint(sessionData),
                userAgent: sessionData.userAgent,
                ip: sessionData.ip
            }).then(session => session.save())
        },

        _footprint(sessionData) {
            return crypto.createHash("md5").update(sessionData.userAgent).digest("hex").toString("hex");
        }

    },

    instance: {

        slide() {
            if (this.sliding === SLIDING.YES) {
                this.tokenExpirationTime = new Date(+ new Date() + this.ttl);
                return this.save();
            }

            return Promise.resolve(this);
        },

        revoke() {
            this.revokeTime = new Date();
            this.state = STATES.REVOKED;
            return this.save();
        }
    }
};


module.exports = SessionsDefinition;