const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const PermissionsFactory            = Factories('Permissions');
const AccountsFactory                = Factories('Accounts');


const PermissionsController = {

    path: PermissionsFactory.__model__.name,

    permissions: {
        PUT: 'Permissions.Grant'
    },

    GET : [
        //accounts/12/permissions
        function (accountsId) {
            if(this.request.session.account.id != accountsId) {
                this.response.status = this.response.statuses._403_Forbidden;
                throw new Errors.Forbidden("You don't have permission to perform this action");
            }

            return AccountsFactory.get({id: accountsId})
                .then(account => {
                    return PermissionsFactory.getByAccount(account);
                });
        }
    ],

    POST : [

    ],

    PUT : [
        //accounts/12/permissions/32
        function (accountsId, permissionsId) {
            return Promise.all([
                    PermissionsFactory.getByRole(permissionsId),
                    AccountsFactory.get({id: accountsId})
                ])
                .then(([rolePermissions, account]) => {
                    if(rolePermissions.length){
                        return Promise.all([rolePermissions, account, PermissionsFactory.getByAccount(account)]);
                    }else{
                        throw new Errors.NotFound(`Permissions for role '${permissionsId}' not found`);
                    }
                })
                .then(([rolePermissions, account, accountPermissions]) => {
                    return Promise.all([
                        rolePermissions,
                        account
                    ].concat(accountPermissions.map(permission => permission.revokeForAccount(account))));
                })
                .then(([rolePermissions, account]) => {
                    rolePermissions.forEach(permission => permission.grantForAccount(account))
                });
        }
    ],

    DELETE : [

    ]
};


module.exports = PermissionsController;