const Repositories              = use('core/repositories');


const AccountsRepository = Repositories.create('accounts', { });


module.exports = AccountsRepository;