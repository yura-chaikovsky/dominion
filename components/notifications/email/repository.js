const Repositories                   = use('core/repositories');


const NotificationEmailRepository    = Repositories.create('notification_emails', {});


module.exports = NotificationEmailRepository;