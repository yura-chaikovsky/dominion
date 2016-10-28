const errors = {
    NotFound: "Entity not found",
    Database: "Database error",
    Fatal: "Dominion Fatal Error",
    Validation: "Validation Error",
    BadRequest: "Bad request",
    Unauthorized: "Unauthorized",
    Forbidden: "Forbidden"
};

Object.keys(errors).forEach((errorType) => {
    errors[errorType] = (new Function(`
        function ${errorType}(message){
            this.name = "${errorType}";
            this.message = message || 'No message provided';
            Error.captureStackTrace(this, this.constructor);
        }

        ${errorType}.prototype = Object.create(Error.prototype);
        ${errorType}.prototype.constructor = ${errorType};

        return ${errorType};
    `))();
});

Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
        return Object.getOwnPropertyNames(this).reduce((obj, key) => {
            obj[key] = this[key];
            return obj;
        }, {});
    },
    configurable: true,
    writable: true
});


module.exports = errors;