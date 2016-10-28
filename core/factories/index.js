const Errors                    = require('core/errors');
const ModelFactoryPrototype     = require('./factoriesPrototype');
const ModelPrototype            = require('./modelsPrototype');


const modelsCollection = new Map();

const Models = function(modelName){
    modelName = modelName.toLowerCase();
    if(modelsCollection.has(modelName)){
        return modelsCollection.get(modelName);
    }else{
        throw new Errors.Fatal(`Model '${modelName}' is not defined`);
    }
};

Models.clear = function () {
    modelsCollection.clear();
};

Models.define = function(modelDescription){
    let modelName = modelDescription.name.toLowerCase();
    if(modelsCollection.has(modelName)){
        throw new Errors.Fatal(`Model with name '${modelName}' already defined`);
    }else{
        modelsCollection.set(modelName, defineModel(modelDescription));
    }
    return modelsCollection.get(modelName);
};

let defineModel = function (modelDescription) {

    let ModelFactory = (new Function(`return function ${modelDescription.name + 'Factory'} (){}`))();
    ModelFactory.prototype = ModelFactoryPrototype;
    let modelFactoryInstance = new ModelFactory();

    Object.assign(modelFactoryInstance, modelDescription.factory);
    modelFactoryInstance.repo = modelDescription.repository;

    let Model = (new Function(`return function ${modelDescription.name}(props){this.__properties__ = {}; this.__name__ = "${modelDescription.name}"; props && this.populate(props)}`))();
    Model.prototype = Object.create(ModelPrototype);
    Model.prototype.repo = modelDescription.repository;
    Model.prototype.scheme = modelDescription.properties;
    Object.assign(Model.prototype, modelDescription.instance);

    Object.defineProperties(Model.prototype, Object.keys(modelDescription.properties).reduce((propertyDefinition, propertyName) => {
        if (Model.prototype.hasOwnProperty(propertyName)){
            throw new Errors.Fatal('Incorrect model definition. Note, model should not contain repo and scheme fields.');
        }
        propertyDefinition[propertyName] = {
            set (value) {
                this.scheme[propertyName].validate(value, propertyName, modelDescription.name);
                this.__properties__[propertyName] = value;
            },
            get () {
                return this.__properties__[propertyName];
            }
        };
        return propertyDefinition;
    }, {}));

    modelFactoryInstance.__model__ = Model;

    return modelFactoryInstance;
};

module.exports = Models;