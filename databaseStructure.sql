CREATE TABLE `accounts` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` BIGINT UNSIGNED,
    `email` VARCHAR(100),
    `password_hash` VARCHAR(255),
    `password_salt` VARCHAR(255),
    `info` JSON,
    `recovery_token` VARCHAR(6) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `phone_number` (`phone_number`)
);

CREATE TABLE `accounts_permissions` (
    `accounts_id` BIGINT,
    `permissions_id` BIGINT,
    UNIQUE KEY `accounts_permissions` (`accounts_id`, `permissions_id`)
);

CREATE TABLE `logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `header` text,
    `body` text,
    `tracking_id` bigint(20) UNSIGNED,
    PRIMARY KEY (`id`)
);

CREATE TABLE `notification_emails` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(255) NULL DEFAULT NULL,
    `provider_name` VARCHAR(255) NULL DEFAULT NULL,
    `accounts_senders_id` BIGINT,
    `sender_email` VARCHAR(255) NULL DEFAULT NULL,
    `subject` VARCHAR(255),
    `body` TEXT,
    `recipient_email_to` JSON NULL DEFAULT NULL,
    `recipient_email_cc` JSON NULL DEFAULT NULL,
    `recipient_email_bcc` JSON NULL DEFAULT NULL,
    `accounts_recipients_id` BIGINT,
    `time_sent` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('QUEUED','SENT','REJECTED', 'ACCEPTED') DEFAULT 'QUEUED',
    `type` ENUM('AUTOMATIC', 'MANUAL') NULL DEFAULT 'AUTOMATIC',
    PRIMARY KEY (`id`)
);

CREATE TABLE `notification_sms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(255) NULL DEFAULT NULL,
    `provider_name` VARCHAR(255) NULL DEFAULT NULL,
    `accounts_senders_id` BIGINT,
    `sender_title` VARCHAR(30),
    `body` VARCHAR(255),
    `recipient_phone` BIGINT UNSIGNED NULL DEFAULT NULL,
    `accounts_recipient_id` BIGINT,
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

CREATE TABLE `permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE `roles_permissions` (
    `roles_id` BIGINT,
    `permissions_id` BIGINT
);

CREATE TABLE `sessions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `accounts_id` BIGINT NOT NULL,
    `token` VARCHAR(100),
    `ip` VARCHAR(15),
    `creation_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expiration_time` TIMESTAMP NULL DEFAULT NULL,
    `close_time` TIMESTAMP NULL DEFAULT NULL,
    `status` ENUM('ACTIVE', 'CLOSED', 'ACTIVE_LOG'),
    `user_agent` VARCHAR(100),
    `close_type` ENUM('LOG_OUT','AFTER_VALIDATION', 'FULL_LOGOUT', 'ON_SCHEDULE'),
    PRIMARY KEY (`id`)
);

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

ALTER TABLE accounts_permissions
ADD CONSTRAINT fk_accounts_permissions_accounts
FOREIGN KEY (accounts_id)
REFERENCES accounts(id);


ALTER TABLE accounts_permissions
ADD CONSTRAINT fk_accounts_permissions_permissions
FOREIGN KEY (permissions_id)
REFERENCES permissions(id);


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



ALTER TABLE roles_permissions
ADD CONSTRAINT fk_roles_permissions_roles
FOREIGN KEY (roles_id)
REFERENCES roles(id);

ALTER TABLE roles_permissions
ADD CONSTRAINT fk_roles_permissions_permissions
FOREIGN KEY (permissions_id)
REFERENCES permissions(id);


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