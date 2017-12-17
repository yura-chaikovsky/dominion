const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const PermissionsFactory        = Factories('Permissions');


function checkPermissions(body) {

    if (!this.request.handler.permission) {
        return Promise.resolve(body);
    }

    if (!this.request.session) {
        this.response.status = this.response.statuses._401_Unauthorized;
        return Promise.reject(new Errors.Unauthorized("Session is invalid"));
    }

    return PermissionsFactory.getByMember(this.request.session.member)
        .then( permissions => {
            this.request.session.permissions = permissions.map(permission => permission.title.toLowerCase());

            if(!this.request.session.permissions.includes(this.request.handler.permission.toLowerCase())){
                this.response.status = this.response.statuses._403_Forbidden;
                return Promise.reject(new Errors.Forbidden("You don't have permission to perform this action"));
            }

            return body;
        });

}

module.exports = checkPermissions;