const Factories                 = use('core/factories');


const PermissionsFactory        = Factories('Permissions');
const AccountsFactory           = Factories('Accounts');

const PermissionsController = {

    path: PermissionsFactory.__model__.name,

    permissions: {
        POST: 'Permissions.Create',
        GET: 'Permissions.Read',
        PUT: 'Permissions.Update',
        DELETE: 'Permissions.Delete'
    },

    GET: [
        // accounts/1/permissions/1
        function(accountId, permissionId){
            return Promise.all([
                AccountsFactory.get({id: accountId}),
                PermissionsFactory.get({id: permissionId})
            ]).then(([account, permission]) =>{
                return permission.grantForAccount(account);
            }).then(result =>{
                if(result.affectedRows){
                    this.response.status = this.response.statuses._201_Created;
                }
            });
        }
    ],

    DELETE: [
        // accounts/1/permissions/1
        function(accountId, permissionId){
            return Promise.all([
                AccountsFactory.get({id: accountId}),
                PermissionsFactory.get({id: permissionId})
            ]).then(([account, permission]) =>{
                return permission.refuseFromAccount(account);
            }).then(result =>{
                if(result.affectedRows){
                    this.response.status = this.response.statuses._201_Created;
                }
            })
        }
    ]
};

module.exports = PermissionsController;