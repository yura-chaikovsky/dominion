const Property                          = use('core/property');
const Errors                            = use('core/errors');

module.exports = new (function Model() {

    this.save = function () {
        return this.repo.save(this);
    };

    this.remove = function () {
        return this.repo.remove(this);
    };

    this.toJSON = function(){
        return Property.outputJSON(this.__properties__, this.scheme);
    };

    this.populate = function(props){
        Object.keys(props).forEach((propName) => {
            if(this.__proto__.hasOwnProperty(propName)){
                this[propName] = props[propName];
            }else{
                throw new Errors.Validation(`The object populating model ${this.__name__} does not match its structure, property ${propName} is redundant`)
            }
        });
    };

    this.validate = function(){
        Property.validate(this.__properties__, this.scheme, this.__name__);
    }

});