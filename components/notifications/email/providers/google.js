const config                    = use('config');
const nodemailer                = require('nodemailer');

const EMAIL_STATUS              = require('./../enums/statuses');


class Google {

    static send(options) {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.mailGate.providers[config.mailGate.active].user,
                pass: config.mailGate.providers[config.mailGate.active].password
            },
        }, {
            from: options.from,
            headers: {}
        });

        return new Promise((resolve, reject) => {
            transporter.sendMail(options, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        }).then(response => {
            response.status = response.rejected.length? EMAIL_STATUS.REJECTED : EMAIL_STATUS.ACCEPTED;
            return response;
        });
    }

}

module.exports = Google;