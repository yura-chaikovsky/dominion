const Errors                      = use("core/errors");


class ValidationPrototype {
    constructor() {
        this._propertyName = '';
        this._propertyValue = undefined;
        this._validatorsSet = new Set();
        this._outputSettings = new Set();
        this._setterFunction = function(value) {
            return value;
        };
    }

    _addOutputSetting(outputSetter) {
        this._outputSettings.add(outputSetter);
    }

    _addMethod(validateFunction) {
        this._validatorsSet.add(validateFunction);
    }

    required() {
        this._requiredFlag = true;
        return this;
    }

    setter(value){
        return this._setterFunction(value);
    }

    validate(value, propertyName, modelName) {
        this._propertyName = propertyName;
        this._propertyValue = value;
        if (this._requiredFlag && !value) {
            throw new Errors.Validation(`In model ${modelName} property ${this._propertyName} is required and can not be empty`);
        }
        if (value || this._requiredFlag) {
            try{
                this._validatorsSet.forEach(validator => validator());
            }
            catch (error){
                if (error instanceof Errors.Validation){
                    throw new Errors.Validation(`In model ${modelName} ` + error.message);
                }else{
                    throw error;
                }
            }
        }
    }

    changeOutput(managedObject, propertyName) {
        let result;

        this._outputSettings.forEach(outputSetter => {
            result = outputSetter(managedObject, propertyName)
        });
    }

    private(){
        this._addOutputSetting(
            (managedObject, property) => {
                delete managedObject[property];
                return managedObject;
            });
        return this;
    }

    setterFunction (setterFunction){
        this._setterFunction = setterFunction;
        return this;
    }
}

module.exports = ValidationPrototype;