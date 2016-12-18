const Errors                    = use('core/errors');
const ModelFactoryPrototype     = require('./factoriesPrototype');
const ModelPrototype            = require('./modelsPrototype');


const factoryCollection = new Map();

const Factories = function(factoryName){
    factoryName = factoryName.toLowerCase();
    if(factoryCollection.has(factoryName)){
        return factoryCollection.get(factoryName);
    }else{
        throw new Errors.Fatal(`Model '${factoryName}' is not defined`);
    }
};

Factories.define = function(factoryDescription){
    let factoryName = factoryDescription.name.toLowerCase();
    if(factoryCollection.has(factoryName)){
        throw new Errors.Fatal(`Model with name '${factoryName}' already defined`);
    }else{
        factoryCollection.set(factoryName, factoryModel(factoryDescription));
    }
    return factoryCollection.get(factoryName);
};

let factoryModel = function (factoryDescription) {

    let FactoryModel = (new Function(`return function ${factoryDescription.name + 'Factory'} (){}`))();
    FactoryModel.prototype = ModelFactoryPrototype;
    let FactoryModelInstance = new FactoryModel();

    Object.assign(FactoryModelInstance, factoryDescription.factory);
    FactoryModelInstance.repo = factoryDescription.repository;

    let Model = (new Function(`return function ${factoryDescription.name}(props){this.__properties__ = {}; this.__name__ = "${factoryDescription.name}"; props && this.populate(props)}`))();
    Model.prototype = Object.create(ModelPrototype);
    Model.prototype.repo = factoryDescription.repository;
    Model.prototype.scheme = factoryDescription.properties;
    Object.assign(Model.prototype, factoryDescription.instance);

    Object.defineProperties(Model.prototype, Object.keys(factoryDescription.properties).reduce((propertyDefinition, propertyName) => {
        if (Model.prototype.hasOwnProperty(propertyName)){
            throw new Errors.Fatal('Incorrect model definition. Note, model should not contain repo and scheme fields.');
        }
        propertyDefinition[propertyName] = {
            set (value) {
                this.scheme[propertyName].validate(value, propertyName, factoryDescription.name);
                this.__properties__[propertyName] = value;
            },
            get () {
                return this.__properties__[propertyName];
            }
        };
        return propertyDefinition;
    }, {}));

    FactoryModelInstance.__model__ = Model;

    return FactoryModelInstance;
};

module.exports = Factories;