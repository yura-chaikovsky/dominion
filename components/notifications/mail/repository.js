const Repositories                   = require('core/repositories');
const NotificationEmailRepository    = Repositories.create('notification_emails', {});

module.exports = NotificationEmailRepository;