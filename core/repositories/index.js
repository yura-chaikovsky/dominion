const RepositoryPrototype       = require('./repositoryPrototype');
const DB                        = require('./db');
const Errors                    = require('./../errors');


const Repositories = () => {};

Repositories.create = function (tableName, repositoryDefinition){
    if(!tableName){
        throw new Errors.Fatal(`Table name is missing in repository definition`);
    }

    const className = tableName[0].toUpperCase() + tableName.slice(1);
    const Repository = (new Function(`return function Repository${className} (){this.__table__ = '${tableName}'}`))();
    Repository.prototype = Object.create(RepositoryPrototype);
    Repository.prototype.db = DB;
    Object.assign(Repository.prototype, repositoryDefinition || {});

    return new Repository();
};


module.exports = Repositories;