const Factories                 = use('core/factories');
const Errors                    = use('core/errors');


const SessionsFactory = Factories('Sessions');
const AccountsFactory = Factories('Accounts');

const authorizeController = {

    path: 'authorize',

    permissions:{},

    GET : [
        //authorize/logout
        function () {
            // @path: authorize/logout
            return SessionsFactory.get({token: this.request.session.token})
                .then(session => session.close());
        },

        //authorize/terminateall
        function () {
            // @path: authorize/terminateall
            return SessionsFactory.find({accounts_id: this.request.session.account.id})
                .then(sessions => {
                    sessions.map(session =>{
                        if(session.token !== this.request.session.token){
                            session.close();
                        }
                    })
                })
        },
    ],

    POST : [
        //authorize/login
        function () {
            // @path: authorize/login
            return AccountsFactory.get({phone_number: this.request.body.phone_number})
                .then(account => {
                    if (account.checkPassword(this.request.body.password)){
                        return SessionsFactory.create(account, {})
                            .then(session =>session.save())
                            .then(session => { return {token: session.token};})
                    }
                })
        },
    ]

};

module.exports = authorizeController;