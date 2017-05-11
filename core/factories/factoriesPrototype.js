const Errors                    = require('./../errors');

module.exports = new (function ModelFactory() {

    this.new = function (properties = {}, ignoreId = true) {
        //toDo - This should be resolved on framework level
        if (ignoreId){
            delete properties.id; // we need it to forbid updating models via POST
        }
        let newModel = new this.__model__(properties);
        return Promise.resolve(Object.freeze(newModel));
    };

    this.get = function(criteria){
        return this.find(criteria, 1, 0).then((models) => {
            if(models.length){
                return models[0];
            }else{
                throw new Errors.NotFound(this.__model__.name + ' model by criteria ' + JSON.stringify(criteria) + ' not found');
            }
        });
    };

    this.find = function (criteria = {}, limit, offset) {
        return this.repo.find(criteria, limit, offset)
            .then(rows => Promise.all(rows.map(row => this.new(row, false))) );
    };

});