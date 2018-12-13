const crypto                    = require('crypto');


function createHash(password, salt){
    return crypto.createHash('sha512').update(salt + password).digest('hex').toString('hex');

}

module.exports = createHash;