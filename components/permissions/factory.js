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

        getByMember: function(member){
            return this.repo.getByMember(member.id)
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

        grantForMember: function (member) {
            return this.repo.grantForMember(member.id, this.id);
        },

        revokeForMember: function (member) {
            return this.repo.revokeForMember(member.id, this.id);
        }

    }
};


module.exports = PermissionsDefinition;