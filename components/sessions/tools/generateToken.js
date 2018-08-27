const crypto                    = require("crypto");


function generateToken(key){
    return crypto.createHash("md5").update(`${key}${+new Date()+Math.random()}`).digest("hex").toString("hex");
}

module.exports = generateToken;