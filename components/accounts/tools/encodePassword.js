const createHash                = require('./createHash');


function encodePassword(password){
    let salt = generateSalt();
    return [createHash(password, salt), salt];
}

function generateSalt(){
    let salt = '';
    for (let i = 0; i < 128; i++){
        salt += String.fromCharCode(random(33, 126));
    }

    return salt;
}

function random(min, max){
    return Math.random() * (max - min) + min;
}

module.exports = encodePassword;