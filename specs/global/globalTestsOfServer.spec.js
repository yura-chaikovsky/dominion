describe('Global tests', () => {
    describe('GET', () => {
        frisby.create('Get status 501 if route doesn\'t exists')
            .get('/notexisting/route')
            .expectStatus(501)
            .toss();
    });
});