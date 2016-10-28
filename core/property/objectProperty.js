let ValidationPrototype = require('./propertyPrototype');
let Errors = require('core/errors');

class ValidationObject extends ValidationPrototype {
    constructor() {
        super();
        this._addMethod(() => {
            if (this._propertyValue && typeof this._propertyValue !== 'object') {
                throw new Errors.Validation(`property ${this._propertyName} should be an object, given '${this._propertyValue}'`)
            }
        });
    }
    
    hasRequiredProperty(...requiredProperties) {
        this._addMethod(()=> {
            for (let requiredProperty of requiredProperties) {
                if (!(this._propertyValue.hasOwnProperty(requiredProperty))) {
                    throw new Errors.Validation(`property ${requiredProperty} is required, but does not exists`);
                }
            }
        });
        return this.required();
    }
}
module.exports = ValidationObject;
