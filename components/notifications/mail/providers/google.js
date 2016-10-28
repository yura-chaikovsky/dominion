var nodemailer = require('nodemailer');
const config = require('config');
const Errors = require('core/errors');
const mailStatuses = require('./../mailStatuses');

const googleStatuses = {
    "QUEUED": mailStatuses.QUEUED,
    "SEND": mailStatuses.SEND,
    "REGECTED": mailStatuses.REGECTED,
    "ACCEPTED": mailStatuses.ACCEPTED
};

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
        }).then(resolve => {

            if (resolve.rejected.length - 1 > null) {

                return {status: mailStatuses['REJECTED'], resolve};


            } else {

                return {status: mailStatuses['ACCEPTED'], resolve};

            }

        })

    }

}

module.exports = Google;