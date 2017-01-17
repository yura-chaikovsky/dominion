const http                    = require('http');
const https                   = require('https');
const uri                     = require('url');


class HttpRequest {

   static request({ url = '', method = 'GET', postBody = '', headers = {} } = {}){

        if(postBody) {
            headers['Content-Length'] = Buffer.byteLength(postBody);
        }

        return new Promise((resolve, reject) => {
            let response = '';
            let urlInformation = uri.parse(url);
            let transport = urlInformation.protocol == 'https:' ? https : http;

            if(urlInformation.port === null){
                if(urlInformation.protocol == 'https:'){
                    urlInformation.port = 443;
                } else {
                    urlInformation.protocol = 80;
                }
            }

            let options = {
                host    : urlInformation.hostname,
                port    : urlInformation.port,
                path    : urlInformation.path,
                method  : method,
                headers : headers
            };

            let req = transport.request(options, res => {
                res.setEncoding('utf8');
                res.on('data', data => response += data )
                   .on('end', () => resolve(response) );
            });

            req.on('error', error => reject(error) );

            req.end(postBody);
        });
    }
}

module.exports = HttpRequest;