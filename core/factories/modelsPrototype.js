const PropertyCollection                = use('core/property/collection');
const Errors                            = use('core/errors');

module.exports = new (function Model() {

    this.save = function () {
        return this.repo.save(this);
    };

    this.remove = function () {
        return this.repo.remove(this);
    };

    this.toJSON = function(){
        return PropertyCollection.output(this.__properties__, this.scheme);
    };

    this.populate = function(props){
        Object.keys(props).forEach((propName) => {
            if(this.__proto__.hasOwnProperty(propName)){
                this[propName] = props[propName];
            }else{
                throw new Errors.Validation(`The object populating model ${this.__name__} does not match its structure, property ${propName} is redundant`)
            }
        });

        return this;
    };

    this.validate = function(){
        PropertyCollection.validate(this.__properties__, this.scheme, this.__name__);
    }

});