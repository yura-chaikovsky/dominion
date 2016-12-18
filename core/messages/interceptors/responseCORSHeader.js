const Message               = use('core/messages');


Message.response.addInterceptor(responseInterceptorAddCORSHeader);

function responseInterceptorAddCORSHeader(body) {
    return Promise.resolve().then(() => {
        this.response.headers['Access-Control-Allow-Origin'] = '*';
        this.response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        this.response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Set-Cookies';
        if(this.request.method == 'OPTIONS'){
            this.response.status = this.response.statuses._200_OK;
        }
        return body;
    });
}
