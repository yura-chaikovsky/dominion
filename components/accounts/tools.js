const crypto                    = require('crypto');


class Tools {

    static createHash(password, salt){
        return crypto.createHash('sha512').update(salt + password).digest('hex').toString('hex');
    }

    static encodePassword(password){
        let salt = this.generateSalt();
        return [this.createHash(password, salt), salt];
    }

    static generateSalt(){
        let salt = '';
        for (let i = 0; i < 128; i++){
            salt += String.fromCharCode(this.random(33, 126));
        }

        return salt;
    }

    static random(min, max){
        return Math.random() * (max - min) + min;
    }


}


module.exports = Tools;