const crypto                    = require('crypto');


class Tools {

    static sha256 (text){
        let buf = crypto.createHash('sha256').update(text).digest('hex');
        return buf.toString('hex');
    }

    static generateSalt () {
        let buf = crypto.randomBytes(16);
        return buf.toString('hex');
    }

    static generatePassword (password, salt) {
        return this.sha256(salt + this.sha256(password));
    }

    static generateRecoveryToken () {
        return (Math.floor(Math.random() * (900000 - 1)) + 100000).toString();
    }
}


module.exports = Tools;