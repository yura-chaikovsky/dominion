const Nodemailer                = require('nodemailer');

const STATUSES                  = require('./../enums/statuses');


class SMTP {

    static send(options) {
        let postman = Nodemailer.createTransport(this.config);

        return postman.sendMail(options)
            .then(response => {
                response.status = STATUSES.SENT;
                return response;
            })
            .catch(error => {
                return {status: STATUSES.FAILED, errorMessage: error.message};
            });
    }

}

module.exports = SMTP;