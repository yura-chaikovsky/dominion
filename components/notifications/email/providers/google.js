const nodemailer                = require('nodemailer');

const EMAIL_STATUS              = require('./../enums/statuses');


class Google {

    static get config() {
        return this._config;
    }

    static set config(config) {
        this._config = config;
    }

    static send(from, to, cc, bcc, subject, html) {

        const options = {from, to, cc, bcc, subject, html};

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this._config.user,
                pass: this._config.password
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