const Message               = use('core/messages');
const Config                = use('config');


Message.response.addInterceptor(responseInterceptorAddCORSHeader);

function responseInterceptorAddCORSHeader(body) {
    return Promise.resolve().then(() => {
        Object.assign(this.response.headers, Config.corsAllowHeaders);
        if(this.request.method == 'OPTIONS'){
            this.response.status = this.response.statuses._200_OK;
        }
        return body;
    });
}
