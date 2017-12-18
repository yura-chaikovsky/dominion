const Errors                    = use('core/errors');

const DefaultProperty           = require('./default');


class NumberProperty extends DefaultProperty {

    constructor() {
        super();

        this._addValidator((value, propertyName) => {
            if (value !== undefined && isNaN(value)) {
                throw new Errors.Validation(`property ${propertyName} should be a number, given '${value}'`);
            }
        });
    }

    min(minValue) {
        this._addValidator((value, propertyName) => {
            if (value < minValue) {
                throw new Errors.Validation(`property ${propertyName} should be bigger than ${minValue}, given '${value}'`);
            }
        });
        return this;
    }

    max(maxValue) {
        this._addValidator((value, propertyName) => {
            if (value > maxValue) {
                throw new Errors.Validation(`property ${propertyName} should be less than ${maxValue}, given '${value}'`);
            }
        });
        return this;
    }

    integer() {
        this._addValidator((value, propertyName) => {
            if (!Number.isInteger(value)) {
                throw new Errors.Validation(`property ${propertyName} should be an integer, given '${value}'`);
            }
        });
        return this;
    }

    price() {
        return this.integer().min(0);
    }

}

module.exports = NumberProperty;