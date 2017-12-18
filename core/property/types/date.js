const Errors                    = use('core/errors');

const DefaultProperty           = require('./default');


class DateProperty extends DefaultProperty {

    constructor() {
        super();

        this._addValidator((value, propertyName) => {
            const originalValue = value;
            if (typeof value !== 'object') {
                value = new Date(value);
            }

            if (value && (!(value instanceof Date) ||  isNaN(value.getTime()))) {
                throw new Errors.Validation(`property ${propertyName} should be a valid DateTime, given '${originalValue}'`);
            }
        });

        this._inputModification = (value) => {
            return (typeof value === "object" && value instanceof Date) ? value : new Date(value);
        };
    }

}

module.exports = DateProperty;