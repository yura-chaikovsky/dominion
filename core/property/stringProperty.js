const Errors                    = use('core/errors');

const ValidationPrototype       = require('./propertyPrototype');


class ValidationString extends ValidationPrototype {
    constructor() {
        super();
        this._addMethod(() => {
            if (this._propertyValue && typeof this._propertyValue !== 'string') {
                throw new Errors.Validation(`property ${this._propertyName} should be a string, given '${this._propertyValue}'`);
            }
        });
    }
    
    min(minValue) {
        this._addMethod(()=> {
            if (this._propertyValue.length < minValue) {
                throw new Errors.Validation(`property ${this._propertyName} should have more than ${minValue} characters, given '${this._propertyValue}' (${this._propertyValue.length})`);
            }
        });
        return this;
    }
    
    max(maxValue) {
        this._addMethod(()=> {
            if (this._propertyValue.length > maxValue) {
                throw new Errors.Validation(`property ${this._propertyName} should have less than ${maxValue} characters, given '${this._propertyValue}' (${this._propertyValue.length})`);
            }
        });
        return this;
    }
}

module.exports = ValidationString;