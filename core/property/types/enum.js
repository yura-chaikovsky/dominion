const Errors                    = use('core/errors');

const DefaultProperty           = require('./default');


class EnumProperty extends DefaultProperty {

    constructor(valuesList) {
        super();

        this._addValidator((value, propertyName) => {
            if (value && !valuesList.includes(value)) {
                throw new Errors.Validation(`property ${propertyName} should have one of enum value: ${valuesList.join(', ')}, given '${value}'`);
            }
        });
    }

}

module.exports = EnumProperty;