const crypto =                require('crypto');

module.exports = {
    sha256: function (text){
        let buf = crypto.createHash('sha256').update(text).digest('hex');
        return buf.toString('hex');
    },

};