-- INSERT IGNORE INTO members_permissions(members_id, permissions_id)
-- (SELECT 96, permissions_id FROM roles_permissions WHERE roles_id = 1);

INSERT IGNORE INTO `roles` VALUES
(1,     'Admin'),
(2,     'Controller'),
(3,     'Customer');


INSERT IGNORE INTO `permissions` VALUES
(100,   'Accounts.Find'),
(102,   'Accounts.Update'),
(104,   'Accounts.Delete'),
(109,   'Accounts.Root'),

(112,   'Permissions.Grant')

;


INSERT IGNORE INTO `roles_permissions` (permissions_id, roles_id) VALUES
-- *** Admin ***
(100,   1),
(102,   1),
(104,   1),
(109,   1),

(112,   1),


-- *** Controller ***



-- *** Customer ***
(102,   3)

;