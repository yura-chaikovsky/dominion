const Message                       = use('core/messages');
const querystring                   = require('querystring');

Message.request.addInterceptor(requestInterceptorAddCookies);

function requestInterceptorAddCookies() {
    return new Promise((resolve, reject) => {
        if (this.request.headers['cookie']){
            this.request.cookies = querystring.parse(this.request.headers['cookie']);
        }
        resolve();
    });
}
