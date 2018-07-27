const Errors                    = use("core/errors");
const Factories                 = use("core/factories");

const MembersFactory            = Factories("Members");
const InvitationsFactory        = Factories("Invitations");
const SessionsFactory           = Factories("Sessions");


const AuthController = {

    path: SessionsFactory.__model__.name,

    permissions: {},

    POST: [
        function () {
            // @path: auth/token
            // @summary: Authenticate account by credentials

            return MembersFactory.get({email: this.request.body.email})
                .then(member => member.checkPassword(this.request.body.password))
                .then(member => SessionsFactory.issue({
                    member,
                    signed: true,
                    sliding: SessionsFactory.SLIDING.YES,
                    ip: this.request.ip,
                    userAgent: this.request.headers["user-agent"],
                }));
        },

        function () {
            // @path: auth/token/revoke
            // @summary: Revoke authentication token

            if (!this.request.session) {
                throw new Errors.Unauthorized("Session is invalid");
            }
            return this.request.session.model.revoke().then(session => "");
        },

        function () {
            // @path: auth/token/revoke/all
            // @summary: Revoke all members authentication token

            if (!this.request.session) {
                throw new Errors.Unauthorized("Session is invalid");
            }
            return SessionsFactory.find({members_id: this.request.session.member.id})
                .then(sessions => Promise.all(sessions.map(session => session.revoke())))
                .then(sessions => "");
        }
    ]
};


module.exports = AuthController;