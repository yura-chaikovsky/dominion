const Repositories              = use('core/repositories');


const PermissionsRepository = Repositories.create('permissions', {
    grantForAccount(accountId, permissionId){
        let query = `INSERT INTO accounts_permissions (accounts_id, permissions_id) VALUES (?, ?)`;
        return this.db.execute(query, [accountId, permissionId]);
    },

    revokeForAccount(accountId, permissionId){
        let query = `DELETE FROM accounts_permissions 
                     WHERE accounts_id = ? AND permissions_id = ? LIMIT 1`;
        return this.db.execute(query, [accountId, permissionId]);
    },

    getByAccount(accountId){
        let query = `SELECT * FROM permissions
                     WHERE id IN
                     (SELECT permissions_id FROM accounts_permissions WHERE accounts_id = ? )`;
        return this.db.execute(query, [accountId])
            .then(([rows]) => rows);
    },

    getByRole(roleId){
        let query = `SELECT *  FROM permissions
                     WHERE id IN
                     (SELECT permissions_id FROM roles_permissions WHERE roles_id = ? )`;
        return this.db.execute(query, [roleId])
            .then(([rows]) => rows);
    }

});


module.exports = PermissionsRepository;
