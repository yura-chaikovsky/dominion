const crypto                    = require("crypto");


function generateToken(memberId){
    return crypto.createHash("md5").update(`${memberId}${+new Date()+Math.random()}`).digest("hex").toString("hex");
}

module.exports = generateToken;