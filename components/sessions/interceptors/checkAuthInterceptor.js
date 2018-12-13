const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const SessionFactory            = Factories('Sessions');
const AccountsFactory            = Factories('Accounts');

function checkAuthInterceptor(body) {
    if (!this.request.headers["authorization"]) {
        return Promise.resolve(body);
    }

    let token = this.request.headers["authorization"].split(" ")[1];
    if (!token) {
        throw new Errors.BadRequest(`Authorization token is malformatted. Expected: "Authorization: Bearer [auth-token]", given: "Authorisation: ${this.request.headers["authorization"]}"`);
    }
    return SessionFactory.get({token, state: "ACTIVE"})
        .then(session => {
            return session.slide()
                .then(session => AccountsFactory.get({id: session.accounts_id}))
                .then(account => {
                    this.request.session = {model: session, account};
                    return Promise.resolve(body);
                });
        })
        .catch(error => {
            if (error instanceof Errors.NotFound) {
                this.response.status = this.response.statuses._401_Unauthorized;
                throw new Errors.Unauthorized("Session is invalid");
            } else {
                throw error;
            }
        });
}

module.exports = checkAuthInterceptor;