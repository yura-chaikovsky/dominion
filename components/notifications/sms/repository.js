const Repositories              = use('core/repositories');


const NotificationSmsRepository = Repositories.create('notification_sms', {});


module.exports = NotificationSmsRepository;