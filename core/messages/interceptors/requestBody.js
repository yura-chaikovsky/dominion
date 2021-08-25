const Errors = require('./../../errors');
const Message = require('./../index');


const JSON_CONTENT_TYPE = "application/json";
const JSON_CONTENT_TYPE_WITH_ENCODING = "application/json; charset=utf-8";
const FORM_URLENCODED_CONTENT_TYPE = "application/x-www-form-urlencoded";

Message.request.addInterceptor(requestInterceptorBodyParser);

function requestInterceptorBodyParser() {
    return new Promise((resolve, reject) => {
        let body = [];

        this.request.__request__
            .on('error', error => {
                reject(new Errors.Fatal(error));
            })
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', data => {
                body = data || Buffer.concat(body).toString();
                this.request.__request__.rawBody = body;
                if(body === ''){
                    return resolve();
                }

                switch (this.request.headers['content-type']) {

                    case JSON_CONTENT_TYPE:
                    case JSON_CONTENT_TYPE_WITH_ENCODING:
                        try{
                            resolve(JSONBodyParser(body, this.request));
                        }catch(error){
                            reject(error);
                        }
                        break;
                    case FORM_URLENCODED_CONTENT_TYPE:
                        resolve(UrlEncodedBodyParser(body, this.request));
                        break;
                    default:
                        reject(new Errors.Fatal("Incorrect Content-Type of the request. Expected 'application/json'."));
                }

            });
    });
}

function JSONBodyParser(body, messageRequest) {
    try {
        body && (messageRequest.body = JSON.parse(body));
    }
    catch (error){
        throw new Errors.BadRequest("Invalid JSON in request body.");
    }
}
function UrlEncodedBodyParser(body, messageRequest) {
    try {
        if(body) {
            messageRequest.body = body.split("&").reduce((body, keypair) => {
                const [key, value] = keypair.split("=");
                body[key]=value;
                return body;
            }, {});
        }
    }
    catch (error){
        throw new Errors.BadRequest("Invalid JSON in request body.");
    }
}
