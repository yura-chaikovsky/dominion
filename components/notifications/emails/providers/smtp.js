const Nodemailer                = require('nodemailer');

const EMAIL_STATUS              = require('./../enums/statuses');


class SMTP {

    static send(options) {
        let postman = Nodemailer.createTransport(this.config);

        return postman.sendMail(options).then(response => {
            response.status = response.rejected.length? EMAIL_STATUS.REJECTED : EMAIL_STATUS.ACCEPTED;
            return response;
        });
    }

}

module.exports = SMTP;