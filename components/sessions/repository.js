const Repositories              = use('core/repositories');


const ServicesRepository = Repositories.create('sessions', {});

module.exports = ServicesRepository;