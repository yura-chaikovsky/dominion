const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const PermissionsFactory        = Factories('Permissions');


function checkPermissions(body) {

    if (!this.request.handler.permission) {
        return body;
    }

    if (!this.request.session) {
        throw new Errors.Unauthorized("Session is invalid");
    }

    return PermissionsFactory.getByAccount(this.request.session.account)
        .then(permissions => {
            this.request.session.permissions = permissions.map(permission => permission.title.toLowerCase());

            if (!this.request.session.permissions.includes(this.request.handler.permission.toLowerCase())) {
                throw new Errors.Forbidden("You don't have permission to perform this action");
            }

            if (this.request.session.permissions.includes(this.request.handler.annotations["rootownerpermissions"])) {
                this.request.session.rootOwner = true;
            }

            return body;
        });

}

module.exports = checkPermissions;