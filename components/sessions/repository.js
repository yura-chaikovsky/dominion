const Repositories              = use('core/repositories');


const SessionsRepository = Repositories.create('sessions', {});

module.exports = SessionsRepository;