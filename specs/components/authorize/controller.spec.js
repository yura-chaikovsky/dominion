const accountInfo = {
    phone_number: 380000518204,
    password: "qwertyu1234!@#$%^*&()_+=?/.,йцукен"
};

const ACCESS_TOKEN_FOR_SESSION_THAT_WILL_CLOSED_1 = "sessionthatwillclosed1e5f4af452d26ccc955dec880e6889888aa4e5a5db3";
const ACCESS_TOKEN_FOR_SESSION_THAT_WILL_CLOSED_2 = "sessionthatwillclosed2e5f4af452d26ccc955dec880e6889888aa4e5a5db3";
const ACCESS_TOKEN_FOR_SESSION_THAT_WILL_NOT_CLOSED = "tokenthatwillsent46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3";



describe('Authorization', () => {

    context('Register', () => {
        frisby.create('should create new account')
            .post('/accounts', accountInfo)
            .expectStatus(201)
            .toss();
    });

    context('Log in', () => {
        frisby.create('should get token')
            .post('/authorize/login', accountInfo)
            .expectStatus(200)
            .expectJSONTypes(
                joi.object({
                    token: joi.string()
                })
            )
            .afterJSON(function (result) {

            })
            .toss();
    });

    context('Log out', () => {
        frisby.create('should get token')
            .post('/authorize/login', accountInfo)
            .expectStatus(200)
            .expectJSONTypes(
                joi.object({
                    token: joi.string()
                })
            )
            .afterJSON(function (result) {
                frisby.create('Authorization: should return status code 200 and log out user')
                    .get('/authorize/logout')
                    .addHeaders({'Access-Token': result.token})
                    .expectStatus(200)
                    .expectHeaderContains('Content-Type', 'json')
                    .toss();

            })
            .toss();
    });

    context('Terminate all', ()=> {
        frisby.create('should get token')
            .get('/authorize/terminateall')
            .addHeaders({'Access-Token': ACCESS_TOKEN_FOR_SESSION_THAT_WILL_NOT_CLOSED})
            .expectStatus(200)
            .after(function () {

            })
            .toss();
    });
});