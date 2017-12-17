const Repositories              = use('core/repositories');


const PermissionsRepository = Repositories.create('permissions', {
    grantForMember(memberId, permissionId){
        let query = `INSERT INTO dmn_members_permissions (members_id, permissions_id) VALUES (?, ?)`;
        return this.db.execute(query, [memberId, permissionId]);
    },

    revokeForMember(accountId, permissionId){
        let query = `DELETE FROM dmn_members_permissions 
                     WHERE members_id = ? AND permissions_id = ? LIMIT 1`;
        return this.db.execute(query, [accountId, permissionId]);
    },

    getByMember(memberId){
        let query = `SELECT * FROM dmn_permissions
                     WHERE id IN
                     (SELECT permissions_id FROM dmn_members_permissions WHERE members_id = ? )`;
        return this.db.execute(query, [memberId])
            .then(([rows]) => rows);
    },

    getByRole(roleId){
        let query = `SELECT *  FROM dmn_permissions
                     WHERE id IN
                     (SELECT permissions_id FROM dmn_roles_permissions WHERE roles_id = ? )`;
        return this.db.execute(query, [roleId])
            .then(([rows]) => rows);
    }

});


module.exports = PermissionsRepository;
