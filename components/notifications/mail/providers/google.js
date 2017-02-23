const nodemailer                = require('nodemailer');
const config                    = use('config');
const mailStatuses              = use('components/notifications/mail/mailStatuses');


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

        return new Promise((resolve, reject)=> {
            transporter.sendMail(options, (error, info)=> {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        }).then(response => {
            if (response.rejected.length) {
                response.status = mailStatuses['REJECTED'];
            } else {
                response.status = mailStatuses['ACCEPTED'];
            }
            return response;
        })

    }

}

module.exports = Google;