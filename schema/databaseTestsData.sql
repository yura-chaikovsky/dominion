INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (1, 380670000001, 'test1@email.ua', 'ef382712847b30453b495528f527acb62beb48c9b9a704ecd9f5df09e1d679d3', '75cd421cccf93e6f6cd54a6b9dc44b4f', NULL, NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (2, 380639962124, 'test2@email.ua', 'd6161e268c7a561b84c96cd9a19f394fe8aa408c1be6f9657e1a9cad0926e76a', '86544615789aab57bb80297c7ab63cb5', '{"name": "Борис"}', NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (3, 380670000003, 'test3@email.ua', 'd703a3b486e9cbe076660e9624d7133db44ddae0f3678b5cb0b916095c5c7780', '6c9d30de00f12507f74da2fac6827cb9', '{"name": "Юрий"}', NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (4, 380670000004, 'test4@email.ua', 'd703a3b486e9cbe076660e9624d7133db44ddae0f3678b5cb0b916095c5c7780', '6c9d30de00f12507f74da2fac6827cb9', '{"name": "Антон"}', NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (5, 380670000005, 'test5@email.ua', '', '', NULL, NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (6, 380670000006, 'empty(without_linked_entities)@email.ua', '', '', NULL, NULL);
INSERT INTO `accounts` (`id`, `phone_number`, `email`, `password_hash`, `password_salt`, `info`, `recovery_token`) VALUES (7, 380670000007, 'test6@email.ua', 'd703a3b486e9cbe076660e9624d7133db44ddae0f3678b5cb0b916095c5c7780', '6c9d30de00f12507f74da2fac6827cb9', '{"name": "Антон"}', NULL);

INSERT INTO `permissions` (`id`, `title`) VALUES (1, 'Accounts.Update');
INSERT INTO `permissions` (`id`, `title`) VALUES (2, 'Accounts.Delete');
INSERT INTO `permissions` (`id`, `title`) VALUES (3, 'Media.Create');


INSERT INTO `accounts_permissions` (`accounts_id`, `permissions_id`) VALUES ('1', '1');
INSERT INTO `accounts_permissions` (`accounts_id`, `permissions_id`) VALUES ('1', '2');
INSERT INTO `accounts_permissions` (`accounts_id`, `permissions_id`) VALUES ('1', '3');


INSERT INTO `sessions` (`id`, `accounts_id`, `token`, `ip`, `creation_time`, `expiration_time`, `close_time`, `status`, `user_agent`, `close_type`) VALUES (1, 1, '39966858ef335404b46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3', '127.0.0.1', '2016-09-09 16:19:30', '2020-09-09 17:33:16', NULL, 'active', '1', NULL);
INSERT INTO `sessions` (`id`, `accounts_id`, `token`, `ip`, `creation_time`, `expiration_time`, `close_time`, `status`, `user_agent`, `close_type`) VALUES (2, 2, '72458462ef335404b46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3', '127.0.0.1', '2016-09-09 16:19:30', '2020-09-09 17:33:16', NULL, 'active', '1', NULL);
INSERT INTO `sessions` (`id`, `accounts_id`, `token`, `ip`, `creation_time`, `expiration_time`, `close_time`, `status`, `user_agent`, `close_type`) VALUES (3, 7, 'tokenthatwillsent46b80e5f4af452d26ccc955dec880e6889888aa4e5a5db3', '127.0.0.1', '2016-09-09 16:19:30', '2020-09-09 17:33:16', NULL, 'active', '1', NULL);
INSERT INTO `sessions` (`id`, `accounts_id`, `token`, `ip`, `creation_time`, `expiration_time`, `close_time`, `status`, `user_agent`, `close_type`) VALUES (4, 7, 'sessionthatwillclosed1e5f4af452d26ccc955dec880e6889888aa4e5a5db3', '127.0.0.1', '2016-09-09 16:19:30', '2020-09-09 17:33:16', NULL, 'active', '1', NULL);
INSERT INTO `sessions` (`id`, `accounts_id`, `token`, `ip`, `creation_time`, `expiration_time`, `close_time`, `status`, `user_agent`, `close_type`) VALUES (5, 7, 'sessionthatwillclosed2e5f4af452d26ccc955dec880e6889888aa4e5a5db3', '127.0.0.1', '2016-09-09 16:19:30', '2020-09-09 17:33:16', NULL, 'active', '1', NULL);

INSERT INTO `roles` (`id`, `title`) VALUES (1, 'default');

INSERT INTO `roles_permissions` (`roles_id`, `permissions_id`) VALUES ('1', '8');
INSERT INTO `roles_permissions` (`roles_id`, `permissions_id`) VALUES ('1', '4');