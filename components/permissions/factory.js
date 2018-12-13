const Property                  = use('core/property');
const PermissionsRepository     = require('./repository');



const PermissionsDefinition = {

    name: 'Permissions',

    repository: PermissionsRepository,

    properties: {
        id: Property.id(),
        title: Property.string()
    },

    factory: {

        getByAccount: function(account){
            return this.repo.getByAccount(account.id)
                .then(permissions => {
                    return Promise.all(permissions.map(permissions => this.new(permissions, false)));
                });
        },

        getByRole: function(roleId){
            return this.repo.getByRole(roleId)
                .then(permissions => {
                    return Promise.all(permissions.map(permissions => this.new(permissions, false)));
                });
        }

    },

    instance: {

        grantForAccount: function (account) {
            return this.repo.grantForAccount(account.id, this.id);
        },

        revokeForAccount: function (account) {
            return this.repo.revokeForAccount(account.id, this.id);
        }

    }
};


module.exports = PermissionsDefinition;