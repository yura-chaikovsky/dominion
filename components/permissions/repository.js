const Repositories              = use('core/repositories');


const PermissionsRepository = Repositories.create('permissions', {
    linkAccount(accountId, permissionId){
        let query = `INSERT INTO accounts_permissions (accounts_id, permissions_id) VALUES (?, ?)`;
        return this.db.execute(query, [accountId, permissionId]);
    },

    unlinkAccount(accountId, permissionId){
        let query = `DELETE FROM accounts_permissions 
                     WHERE accounts_id = ? AND permissions_id = ?`;
        return this.db.execute(query, [accountId, permissionId]);
    },

    getAccountsPermissions(accountId){
        let query = `SELECT ${this.__table__}.* FROM ${this.__table__} 
                     INNER JOIN accounts_permissions 
                     ON accounts_permissions.permissions_id = permissions.id 
                     WHERE accounts_permissions.accounts_id = ? `;
        return this.db.execute(query, [accountId])
            .then(([rows, columns]) => rows);
    },

    getByRole(title){
        let query = `SELECT ${this.__table__}.*  FROM roles
                     INNER JOIN roles_permissions ON roles_permissions.roles_id = roles.id
                     INNER JOIN ${this.__table__} ON ${this.__table__}.id = roles_permissions.permissions_id 
                     WHERE roles.title = ?;`;
        return this.db.execute(query, [title])
            .then(([rows, columns]) => rows);
    }
});


module.exports = PermissionsRepository;