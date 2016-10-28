const Message                       = require('core/messages');


Message.request.addInterceptor(requestInterceptorAddCookies);

function requestInterceptorAddCookies() {
    return new Promise((resolve, reject) => {
        if (this.request.headers['cookie']){
            this.request.cookies = cookieParser(this.request.headers['cookie']);
        }
        resolve();
    });
}

function cookieParser(cookieString){
    return cookieString.split(';').reduce((result, nameValuePair) => {
        [name, value] = nameValuePair.split('=');
        result[name] = value;
        return result;
    }, {})
}