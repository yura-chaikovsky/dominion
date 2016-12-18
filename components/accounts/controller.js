const Factories                 = use('core/factories');
const Errors                    = use('core/errors');


const AccountsFactory           = Factories('Accounts');
const PermissionsFactory        = Factories('Permissions');

const AccountsController = {

    path: AccountsFactory.__model__.name,

    permissions: {
        PUT: 'Accounts.Update',
        DELETE: 'Accounts.Delete'
    },

    GET : [
        // accounts/23
        function (accountsId) {
            return AccountsFactory.get({id: accountsId});
        }
    ],

    POST : [
        // accounts
        function () {
            if(this.request.body.phone_number) {
                return AccountsFactory.get({phone_number: this.request.body.phone_number}).then((getAccount)=> {

                    if (getAccount.password_hash != '') {
                        throw new Errors.BadRequest("Registration error: user already registered");
                    }

                    getAccount.createPasswordHash(this.request.body.password);
                    getAccount.populate(this.request.body);

                    return getAccount.save();

                }).catch((error)=> {

                    if (error instanceof Errors.NotFound) {
                        let password = this.request.body.password;
                        delete this.request.body.password;
                        return AccountsFactory.new(this.request.body)
                            .then(account=> {
                                account.createPasswordHash(password);
                                this.response.status = this.response.statuses._201_Created;
                                return account.save();
                            })
                            .then(account => {
                                return PermissionsFactory.getByRole("default")
                                    .then((permissions) => {
                                        permissions.forEach(permission => {
                                            permission.grantForAccount(account);
                                        })
                                    })
                            });

                    } else {
                        throw error;
                    }

                });
            } else {
                throw new Errors.BadRequest("Error: phone number is a required parameter");
            }
        }
    ],

    PUT : [
        // accounts/23
        function (accountsId) {
            if(this.request.body.phone_number){
                return AccountsFactory.get({id: accountsId, phone_number: this.request.body.phone_number})
                    .then((account)=> {
                        account.populate(this.request.body);
                        return account.save();
                    });

            } else {
                throw new Errors.BadRequest("Error: phone number is a required parameter");
            }
        }
    ],

    DELETE : [
        // accounts/1
        function (accountsId) {

            return AccountsFactory.get({id: accountsId})
                .then((account) => {
                    return account.remove();
                })
                .then((result) => {
                    if(result.affectedRows){
                        this.response.status = this.response.statuses._204_NoContent;
                    }
                });
        }
     ]
};


module.exports = AccountsController;