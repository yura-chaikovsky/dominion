const Config                    = use('config');
const Errors                    = use('core/errors');

function requestInterceptorAddCORSHeader() {
    let allowedOrigins;

    if(this.request.headers.origin === undefined){
        return;
    }

    if(Config.cors.origin === '*'){
        this.response.headers['Access-Control-Allow-Origin'] = '*';
    }else{
        this.response.headers['Vary'] = (this.response.headers['Vary']? this.response.headers['Vary'] + ', ': '') + 'Origin';

        allowedOrigins = Array.isArray(Config.cors.origin)? Config.cors.origin : Config.cors.origin.call(this);
        if(allowedOrigins.indexOf(this.request.headers.origin) === -1){
            throw new Errors.Forbidden(`Origin '${this.request.headers.origin}' is not allowed`);
        }
        this.response.headers['Access-Control-Allow-Origin'] = this.request.headers.origin;
    }

    if(this.request.method === 'OPTIONS'){
        this.response.headers['Access-Control-Allow-Methods'] = Config.cors.methods.toString();
        this.response.headers['Access-Control-Allow-Headers'] = Config.cors.headers.toString();
        this.response.headers['Access-Control-Allow-Credentials'] = Config.cors.credentials.toString();
        this.response.headers['Access-Control-Allow-Max-Age'] = Config.cors.maxAge.toString();

        if(Config.cors.exposeHeaders){
            this.response.headers['Access-Control-Expose-Headers'] = Config.cors.exposeHeaders.toString();
        }
    }

}

module.exports = requestInterceptorAddCORSHeader;