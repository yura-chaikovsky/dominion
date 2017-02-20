
function responseInterceptorAdd200Status(body) {
    if(this.request.method === 'OPTIONS'){
        this.response.status = this.response.statuses._200_OK;
    }

    return body;
}

module.exports = responseInterceptorAdd200Status;