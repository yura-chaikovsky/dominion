const Property                  = use('core/property');

const PermissionsRepository     = require('./repository');


const ResourcesDefinition = {

    name: 'Permissions',

    repository: PermissionsRepository,

    properties: {
        id: Property.id(),
        title: Property.string()
    },

    factory: {
        checkAvailability: function(permissionTitle){
            return this.get({title: permissionTitle})
                .then(permission => true)
                .catch(error => false)
        },

        getAccountsPermissions: function(account){
            return PermissionsRepository.getAccountsPermissions(account.id)
            .then(permissions => {
                return Promise.all(permissions.map(permissions => this.new(permissions, false)));
            });
        },

        getByRole: function(title){
            return PermissionsRepository.getByRole(title)
            .then(permissions => {
                return Promise.all(permissions.map(permissions => this.new(permissions, false)));
            });
        }
    },

    instance: {
        grantForAccount: function (account) {
            return this.repo.linkAccount(account.id, this.id);
        },

        refuseFromAccount: function (account) {
            return this.repo.unlinkAccount(account.id, this.id);
        }
    }
};


module.exports = ResourcesDefinition;