const Message               = use('core/messages');


Message.response.addInterceptor(responseInterceptorAddCORSHeader);

function responseInterceptorAddCORSHeader(body) {
    return Promise.resolve().then(() => {
        this.response.headers['Access-Control-Allow-Origin'] = '*';
        return body;
    });
}
