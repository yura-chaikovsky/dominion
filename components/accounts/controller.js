const Config                    = use("config");
const Factories                 = use('core/factories');
const Errors                    = use('core/errors');


const AccountsFactory           = Factories('Accounts');
const PermissionsFactory        = Factories('Permissions');
const SessionsFactory           = Factories('Sessions');
const NotificationsEmails       = Factories("NotificationsEmails");

const AccountsController = {

    path: AccountsFactory.__model__.name,

    permissions: {
        PUT: 'Accounts.Update',
        DELETE: 'Accounts.Delete'
    },

    GET : [
        // accounts/23
        function (accountsId) {
            // @rootOwnerPermissions: Accounts.Root

            return AccountsFactory.get({id: accountsId})
                .then(account => account.confirmOwner(this.request.session));
        }
    ],

    POST : [
        // accounts
        function () {
            const accountData = Object.assign({}, this.request.body);
            delete accountData.password;

            return AccountsFactory.new(accountData)
                .then(account => {
                    if (this.request.body.password) {
                        account.setPassword(this.request.body.password);
                    }
                    return account;
                })
                .then(account => account.save())
                .then(account => Promise.all([account, PermissionsFactory.getByRole(AccountsFactory.ROLES.CUSTOMER)]))
                .then(([account, rolePermissions]) => Promise.all([
                    account,
                    ...rolePermissions.map(permission => permission.grantForAccount(account))
                ]))
                .then(([account]) => account);
        },

        function (email = null) {
            // @path: accounts/reset-password
            // @summary: Send reset password link
            // @description:  Link's query string contains `email` and `token` keys. Token is a valid Authorization token expiring in 6 hours after creation.

            return AccountsFactory.get({email})
                .then(account => Promise.all([account, SessionsFactory.issue({
                    account,
                    signed: true,
                    ttl: 6 * 3600 * 1000,
                    sliding: SessionsFactory.SLIDING.NO,
                    ip: this.request.ip,
                    userAgent: this.request.headers["user-agent"],
                })]))
                .then(([account, session]) => NotificationsEmails.new(Object.assign(
                    { recipient_to: [account.email] },
                    require("./emails/reset-password.tpl"),
                    Config.emailGate.senders.default))
                    .then(email => email.fillTemplate({
                        "[server-host]"     : Config.server.url,
                        "[accounts-id]"      : account.id,
                        "[session-token]"   : session.token
                    }).send())
                )
                .then(email => "")
        }
    ],

    PUT : [
        // accounts/23
        function (accountsId) {
            // @rootOwnerPermissions: Accounts.Root

            if(this.request.body.phone_number){
                return AccountsFactory.get({id: accountsId, phone_number: this.request.body.phone_number})
                    .then(account => account.populate(this.request.body))
                    .then(account => account.confirmOwner(this.request.session))
                    .then(account => {
                        if(this.request.body.password_hash) {
                            account.setPassword(this.request.body.password_hash);
                        }
                        return account;
                    })
                    .then(account => account.save());

            } else {
                throw new Errors.BadRequest("Error: phone number is a required parameter");
            }
        }
    ],

    DELETE : [
        // accounts/1
        function (accountsId) {
            // @rootOwnerPermissions: Accounts.Root

            return AccountsFactory.get({id: accountsId})
                .then(account => account.confirmOwner(this.request.session))
                .then(account => account.remove())
                .then(result => {
                    if(result.affectedRows){
                        this.response.status = this.response.statuses._204_NoContent;
                    }
                });
        }
    ]
};


module.exports = AccountsController;