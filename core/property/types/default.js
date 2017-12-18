const Errors = use("core/errors");


class PropertyPrototype {

    constructor() {
        this._validators = new Set();
        this._outputModifications = new Set();
    }

    _addValidator(validateFunction) {
        this._validators.add(validateFunction);
    }

    _addOutputModification(outputSetter) {
        this._outputModifications.add(outputSetter);
    }

    _inputModification(value) {
        return value;
    }

    _validate(value, propertyName, modelName) {
        try {
            this._validators.forEach(validator => validator.call(this, value, propertyName, modelName));
        }
        catch (error) {
            if (error instanceof Errors.Validation) {
                throw new Errors.Validation(`In model ${modelName} ` + error.message);
            } else {
                throw error;
            }
        }
    }

    _output(outputObject, propertyName) {
        this._outputModifications.forEach(outputSetter => outputSetter(outputObject, propertyName));
    }
}

class DefaultProperty extends PropertyPrototype {
    required() {
        this._addValidator((value, propertyName) => {
            if (typeof value === 'undefined' || value === null) {
                throw new Errors.Validation(`property ${propertyName} is required, but does not exists`);
            }
        });
        return this;
    }

    private() {
        this._addOutputModification((outputObject, propertyName) => {
            delete outputObject[propertyName];
        });
        return this;
    }
}

module.exports = DefaultProperty;