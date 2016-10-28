const Errors                    = require('core/errors');
const Factories                 = require('core/factories');


function requestInterceptorAuthentication() {
    const SessionsFactory = Factories("Sessions");
    const AccountsFactory = Factories("Accounts");
    const PermissionsFactory = Factories("Permissions");

    return new Promise((resolve, reject) => {
        let token = this.request.headers["access-token"];
        if(!token){
            resolve();
            return;
        }

        SessionsFactory.get({token: token}).then(session => {
            if (!session.isActive()){
                resolve();
                return;
            }

            session.refresh(this.request);
            
            AccountsFactory.get({id: session.accounts_id})
                .then(account => {
                    return PermissionsFactory.getAccountsPermissions(account).then(permissions => {
                        this.request.session = {
                            token,
                            account,
                            permissions: permissions.map(permission => permission.title)
                        };
                        resolve();
                    })
                })
                .catch(e => e instanceof Errors.NotFound? resolve() : reject(e));
        })
        .catch(e => {
            if(e instanceof Errors.NotFound){
                //ToDo: Create new session
                resolve(e);
            }else{
                reject(e);
            }
        });
    });
}

module.exports = requestInterceptorAuthentication;