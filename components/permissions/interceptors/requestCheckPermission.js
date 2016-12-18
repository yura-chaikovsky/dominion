const Errors                    = use('core/errors');


function requestInterceptorCheckPermissions() {
    return new Promise((resolve, reject) => {

        if (!this.request.handler.permission){
            resolve();
            return;
        }

        if (!this.request.session){
            this.response.status = this.response.statuses._401_Unauthorized;
            reject(new Errors.Unauthorized("Session is invalid"));
        }

        if( !this.request.session.permissions.includes(this.request.handler.permission)){
            this.response.status = this.response.statuses._403_Forbidden;
            reject(new Errors.Forbidden("You don't have required permissions"));
        }
        
        resolve();
    });
}

module.exports = requestInterceptorCheckPermissions;