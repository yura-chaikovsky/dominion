const Property                  = use('core/property');

const LogsRepository            = require('./repository');


const LogsDefinition = {

    name: 'Logs',

    repository: LogsRepository,

    properties: {
        id: Property.id(),
        header: Property.string(),
        body: Property.string(),
        tracking_id: Property.id()
    },

    factory: {},

    instance: {}
};


module.exports = LogsDefinition;