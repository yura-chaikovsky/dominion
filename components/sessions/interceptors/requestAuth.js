const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const SessionFactory            = Factories('Sessions');
const MembersFactory            = Factories('Members');

function checkAuthInterceptor(body) {
    if (!this.request.headers["authorization"]) {
        return Promise.resolve(body);
    }

    return SessionFactory.get({token: this.request.headers["authorization"].split(" ")[1], state: "ACTIVE"})
        .then(session => {
            return session.slide()
                .then(session => MembersFactory.get({id: session.members_id}))
                .then(member => {
                    this.request.session = {model: session, member};
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