const Property                       = use('core/property');

const TrackingRepository             = require('./repository');


const TrackingDefinition = {

    name: 'Tracking',

    repository: TrackingRepository,

    properties: {
        id: Property.id(),
        method: Property.enum('GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'),
        url: Property.string(),
        referrer: Property.string(),
        tracking_token: Property.string(),
        accounts_id: Property.model('Accounts'),
        time: Property.string(),
        access_token: Property.string(),
        user_agent: Property.string(),
        ip: Property.string().max(16)
    },

    factory: {},

    instance: {}
};


module.exports = TrackingDefinition;