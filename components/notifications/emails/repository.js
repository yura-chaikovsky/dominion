const Repositories                   = use('core/repositories');

const NotificationEmailsRepository    = Repositories.create('notification_emails', {});


module.exports = NotificationEmailsRepository;