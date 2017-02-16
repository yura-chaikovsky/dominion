const Message               = use('core/messages');
const Config                = use('config');


Message.response.addInterceptor(responseInterceptorAddCORSHeader);

function responseInterceptorAddCORSHeader(body) {
    return Promise.resolve().then(() => {
        Object.keys(Config.CorsAllowHeaders).forEach((key)=>{
            this.response.headers[key] = Config.CorsAllowHeaders[key];
        });
        if(this.request.method == 'OPTIONS'){
            this.response.status = this.response.statuses._200_OK;
        }
        return body;
    });
}
