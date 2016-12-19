const Errors                    = use('core/errors');

const ValidationNumber          = require('./numberProperty');
const ValidationString          = require('./stringProperty');
const ValidationObject          = require('./objectProperty');
const PropertyPrototype         = require('./propertyPrototype');


class Property {
    
    static number() {
        return new ValidationNumber();
    }
    
    static id() {
        let validationNumber = new ValidationNumber();
        return validationNumber.integer().min(1);
    }
    
    static string() {
        return new ValidationString();
    }
    
    static object() {
        return new ValidationObject();
    }
    
    static model(modelName) {
        const Factories = use('core/factories');
        let property = new ValidationNumber().integer();
        
        property._addMethod(
            function () {
                try {
                    Factories(modelName);
                }
                catch (error) {
                    if(error instanceof Errors.Fatal){
                        throw new Errors.Validation(`property ${property._propertyName} should be a model ${modelName}, but such model is not defined`);
                    }else{
                        throw error;
                    }
                }
            }
        );
        
        property._addOutputSetting(
            (managedObject, propertyName) => {
                managedObject[propertyName] = {
                    id: managedObject[propertyName],
                    link: modelName.toLowerCase() + "/" + managedObject[propertyName]
                };
            });

        return property;
    }
    
    static enum(valueList) {
        let property = new PropertyPrototype();
        
        property._addMethod(
            function () {
                if (!valueList.includes(property._propertyValue)) {
                    throw new Errors.Validation(`property ${property._propertyName} should have one of enum value: ${valueList.join(', ')}, given '${property._propertyValue}'`)
                }
            }
        );
        
        return property;
    }

    static set(valueList) {
        let property = new PropertyPrototype();

        property._addMethod(
            function () {
                if(!Array.isArray(property._propertyValue)){
                    throw new Errors.Validation(`property ${property._propertyName} should be an array, given [${typeof property._propertyValue}] '${property._propertyValue}'`)
                }
                property._propertyValue.forEach((val) => {
                    if (!valueList.includes(val)) {
                        throw new Errors.Validation(`property ${property._propertyName} should have one of enum value: ${valueList.join(', ')}, given '${property._propertyValue}'`)
                    }
                });
            }
        );

        return property;
    }
    
    static validate(object, schema, modelName) {
        Object.keys(schema)
            .forEach(property => schema[property].validate(object[property], property, modelName));
    }
    
    static outputJSON(object, schema) {
        let managedObject = Object.assign({}, object);

        Object.keys(schema)
            .forEach( property => schema[property].changeOutput(managedObject, property));
        
        return managedObject;
    }
    
}

module.exports = Property;