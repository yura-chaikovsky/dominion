const Errors                    = use('core/errors');

const DefaultProperty           = require('./default');


class ModelProperty extends DefaultProperty {

    constructor(modelName) {
        super();

        const Factories = use('core/factories');


        this._addValidator((value, propertyName) => {
            if (value !== null && (
                       (typeof value === "object" && (!Number.isInteger(value.id) || value.id < 1))
                    || (typeof value !== "object" && (!Number.isInteger(value) || value < 1))
                )
            ) {
                throw new Errors.Validation(`property ${propertyName} should be positive integer or model instance, given '${value}'`);
            }
        });

        this._addValidator((value, propertyName) => {
            try {
                Factories(modelName);
            }
            catch (error) {
                if (error instanceof Errors.Fatal) {
                    throw new Errors.Validation(`property ${propertyName} should be a model ${modelName}, but such model is not defined`);
                } else {
                    throw error;
                }
            }
        });

        this._addOutputModification((outputObject, propertyName) => {
            outputObject[propertyName] = {
                id: outputObject[propertyName],
                link: modelName.toLowerCase() + "/" + outputObject[propertyName]
            };
        });

        this._inputModification = (value) => {
            return (value !== null && typeof value === "object" && Number.isInteger(value.id)) ? value.id : value;
        };
    }

}

module.exports = ModelProperty;