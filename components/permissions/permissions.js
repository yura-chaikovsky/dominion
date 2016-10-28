const Factories                 = require('core/factories');
const Errors                    = require('core/errors');


const PermissionsFactory             =Factories('Permissions');

class Permissions {
    
    static checkRequiredPermissions(permissions) {
        return Promise.all(permissions.map(permission => PermissionsFactory.checkAvailability(permission)))
            .then(results => {
                results.forEach(result => {
                    if (!result) {
                        throw new Errors.Fatal(`Required permission '${permission}' is absent in database.`)
                    }
                })
            })
    }

}

module.exports = Permissions;