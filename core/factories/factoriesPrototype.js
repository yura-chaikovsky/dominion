const Errors                    = require('./../errors');

module.exports = new (function ModelFactory() {

    this.new = function (properties = {}, unsaved = true) {
        let newModel = new this.__model__(properties);
        newModel.__unsaved__ = unsaved;
        return Promise.resolve(Object.seal(newModel));
    };

    this.get = function (criteria) {
        return this.find(criteria, 1, 0).then((models) => {
            if (models.length) {
                return models[0];
            } else {
                throw new Errors.NotFound(this.__model__.name + ' model by criteria ' + JSON.stringify(criteria) + ' not found');
            }
        });
    };

    this.find = function (criteria = {}, limit, offset, order) {
        return this.repo.find(criteria, limit, offset, order)
            .then(rows => Promise.all(rows.map(row => this.new(row, false))));
    };

    this.fetch = function (criteria) {
        const id = Object.values(criteria)[0];

        if (this.__cache__.has(id)) {
            return Promise.resolve(this.__cache__.get(id)[0]);
        } else {
            return this.get(criteria).then(model => {
                this.__cache__.set(id, [model, new Date()]);
                setTimeout(() => this.__cache__.delete(id), this.__cacheDuration__);
                return model;
            });
        }
    }

});