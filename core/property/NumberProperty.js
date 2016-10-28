let Errors = require('core/errors');
let ValidationPrototype = require('./propertyPrototype');

class ValidationNumber extends ValidationPrototype {
    constructor() {
        super();
        this._addMethod(() => {
            if (this._propertyValue !== undefined && isNaN(this._propertyValue)) {
                throw new Errors.Validation(`property ${this._propertyName} should be a number, given '${this._propertyValue}'`);
            }
        });
    }
    
    min(minValue) {
        this._addMethod(() => {
                if (this._propertyValue < minValue) {
                    throw new Errors.Validation(`property ${this._propertyName} should be bigger than ${minValue}, given '${this._propertyValue}'`);
                }
            }
        );
        return this;
    }
    
    max(maxValue) {
        this._addMethod(()=> {
                if (this._propertyValue > maxValue) {
                    throw new Errors.Validation(`property ${this._propertyName} should be less than ${maxValue}, given '${this._propertyValue}'`);
                }
            }
        );
        return this;
    }
    
    integer() {
        this._addMethod(()=> {
                if (!Number.isInteger(this._propertyValue)) {
                    throw new Errors.Validation(`property ${this._propertyName} should be an integer, given '${this._propertyValue}'`);
                }
            }
        );
        return this;
    }
    
    price() {
        return this.integer().min(0);
    }
}

module.exports = ValidationNumber;