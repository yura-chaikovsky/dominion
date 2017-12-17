const Factories                 = use('core/factories');
const Errors                    = use('core/errors');

const PermissionsFactory            = Factories('Permissions');
const MembersFactory                = Factories('Members');


const PermissionsController = {

    path: PermissionsFactory.__model__.name,

    permissions: {
        PUT: 'Permissions.Grant'
    },

    GET : [

    ],

    POST : [

    ],

    PUT : [
        //members/12/permissions/32
        function (membersId, permissionsId) {
            return Promise.all([
                    PermissionsFactory.getByRole(permissionsId),
                    MembersFactory.get({id: membersId})
                ])
                .then(([rolePermissions, member]) => {
                    if(rolePermissions.length){
                        return Promise.all([rolePermissions, member, PermissionsFactory.getByMember(member)]);
                    }else{
                        throw new Errors.NotFound(`Permissions for role '${permissionsId}' not found`);
                    }
                })
                .then(([rolePermissions, member, memberPermissions]) => {
                    return Promise.all([
                        rolePermissions,
                        member
                    ].concat(memberPermissions.map(permission => permission.revokeForMember(member))));
                })
                .then(([rolePermissions, member]) => {
                    rolePermissions.forEach(permission => permission.grantForMember(member))
                });
        }
    ],

    DELETE : [

    ]
};


module.exports = PermissionsController;