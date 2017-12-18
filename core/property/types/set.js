const Errors                    = use('core/errors');

const DefaultProperty           = require('./default');


class SetProperty extends DefaultProperty {

    constructor(valuesList) {
        super();

        this._addValidator((value, propertyName) => {
            if (value && !Array.isArray(value)) {
                throw new Errors.Validation(`property ${propertyName} should be an array, given [${typeof value}] '${value}'`);
            }
        });

        this._addValidator((value, propertyName) => {
            value && value.forEach((val) => {
                if (!valuesList.includes(val)) {
                    throw new Errors.Validation(`property ${propertyName} should have one of enum value: ${valuesList.join(', ')}, given '${val}'`);
                }
            });
        });
    }

}

module.exports = SetProperty;