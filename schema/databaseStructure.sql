CREATE TABLE `accounts` (
    `id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
    `phone_number` BIGINT UNSIGNED,
    `email` VARCHAR(100),
    `password_hash` VARCHAR(255),
    `password_salt` VARCHAR(255),
    `info` JSON,
    `recovery_token` VARCHAR(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `phone_number` (`phone_number`)
);

CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `roles_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `roles_id` int(10) unsigned NOT NULL,
  `permissions_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `permissions_roles_idx` (`roles_id`),
  KEY `permissions_permissions_idx` (`permissions_id`),
  CONSTRAINT `permissions_permissions` FOREIGN KEY (`permissions_id`) REFERENCES `permissions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `permissions_roles` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `accounts_permissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `accounts_id` int(10) unsigned NOT NULL,
  `permissions_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_permission_unique` (`accounts_id`,`permissions_id`),
  KEY `permission_permission_idx` (`permissions_id`),
  CONSTRAINT `permission_accounts` FOREIGN KEY (`accounts_id`) REFERENCES `accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `permission_permission` FOREIGN KEY (`permissions_id`) REFERENCES `permissions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `header` text,
    `body` MEDIUMTEXT NULL DEFAULT NULL,
    `tracking_id` bigint(20) UNSIGNED,
    PRIMARY KEY (`id`)
);

CREATE TABLE `notification_emails` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `messages_id` varchar(255) DEFAULT NULL,
  `provider_type` varchar(255) DEFAULT NULL,
  `accounts_senders_id` bigint(20) unsigned DEFAULT NULL,
  `sender_from` varchar(255) DEFAULT NULL,
  `sender_reply_to` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` text,
  `recipient_to` json DEFAULT NULL,
  `recipient_cc` json DEFAULT NULL,
  `recipient_bcc` json DEFAULT NULL,
  `accounts_recipients_id` bigint(20) unsigned DEFAULT NULL,
  `time_sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('QUEUED','SENT','FAILED','REJECTED') DEFAULT 'QUEUED',
  `type` enum('AUTOMATIC','MANUAL') DEFAULT 'AUTOMATIC',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `notification_sms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(255) NULL DEFAULT NULL,
    `provider_name` VARCHAR(255) NULL DEFAULT NULL,
    `accounts_senders_id` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
    `sender_title` VARCHAR(30),
    `body` VARCHAR(255),
    `recipient_phone` BIGINT UNSIGNED NULL DEFAULT NULL,
    `accounts_recipient_id` BIGINT(20) UNSIGNED NULL DEFAULT NULL,
    `time_queued` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `time_sent` TIMESTAMP NULL DEFAULT NULL,
    `time_received` TIMESTAMP NULL DEFAULT NULL,
    `time_failed` TIMESTAMP NULL DEFAULT NULL,
    `status` ENUM('NEW','ENQUEUED','ACCEPTED','UNDELIVERED','REJECTED','PARTLY_DELIVERED','DELIVERED','EXPIRED','DELETED') DEFAULT 'NEW',
    `type` ENUM('AUTOMATIC', 'MANUAL') NULL DEFAULT 'AUTOMATIC',
    `price_internal` INT UNSIGNED,
    `price_external` INT UNSIGNED,
    PRIMARY KEY (`id`)
);

CREATE TABLE `sessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  `state` enum('ACTIVE','EXPIRED','REVOKED') DEFAULT 'ACTIVE',
  `accounts_id` int(10) unsigned DEFAULT NULL,
  `issueTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ttl` int(10) unsigned NOT NULL,
  `sliding` ENUM('0', '1') NULL DEFAULT '0',
  `signExpirationTime` timestamp NULL DEFAULT NULL,
  `tokenExpirationTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `revokeTime` timestamp NULL DEFAULT NULL,
  `footprint` mediumtext,
  `userAgent` varchar(250) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `key_state_expire` (`state`,`tokenExpirationTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET GLOBAL event_scheduler = ON;
CREATE EVENT e_session_state
    ON SCHEDULE
      EVERY 15 minute
    DO
      UPDATE sessions SET state = "EXPIRED" WHERE state = "ACTIVE" AND tokenExpirationTime < NOW();


CREATE TABLE `tracking` (
    `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `method` VARCHAR(9),
    `url` VARCHAR(150),
    `referrer` VARCHAR(100),
    `tracking_token` VARCHAR(100),
    `accounts_id` BIGINT,
    `time` TIMESTAMP,
    `access_token` VARCHAR(100),
    `user_agent` VARCHAR(21000),
    `ip` VARCHAR(15),
    PRIMARY KEY (id)
);

ALTER TABLE notification_emails
ADD CONSTRAINT fk_notification_emails_accounts_senders
FOREIGN KEY (accounts_senders_id)
REFERENCES accounts(id);

ALTER TABLE notification_emails
ADD CONSTRAINT fk_notification_emails_accounts_recipients
FOREIGN KEY (accounts_recipients_id)
REFERENCES accounts(id);


ALTER TABLE notification_sms
ADD CONSTRAINT fk_notification_sms_accounts_senders
FOREIGN KEY (accounts_senders_id)
REFERENCES accounts(id);

ALTER TABLE notification_sms
ADD CONSTRAINT fk_notification_sms_accounts_recipient
FOREIGN KEY (accounts_recipient_id)
REFERENCES accounts(id);


ALTER TABLE sessions
ADD CONSTRAINT fk_sessions_accounts
FOREIGN KEY (accounts_id)
REFERENCES accounts(id);


ALTER TABLE tracking
ADD CONSTRAINT fk_tracking_accounts
FOREIGN KEY (accounts_id)
REFERENCES accounts(id);


ALTER TABLE logs
ADD CONSTRAINT fk_logs_tracking
FOREIGN KEY (tracking_id)
REFERENCES tracking(id);