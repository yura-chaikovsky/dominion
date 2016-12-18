const Repositories              = use('core/repositories');


const LogsRepository = Repositories.create('logs', {});


module.exports = LogsRepository;