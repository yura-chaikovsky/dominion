module.exports = {
    server: {
        host: 'localhost',
        port: 3000
    },

    router: {
        urlPrefix: ''
    },
    
    database: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'dominion'
    },
    
    media: {
        urlPath: '/media',
        saveDir: '../../media',
        supportsTypes: [
            'image/jpeg',
            'image/png',
            'image/gif'
        ]
    },

    smsGate: {
        active: 1,
        providers: [
            {
                name: 'smsProvider1',
                senderName: 'Dominion',
                token: ''
            },
            {
                name: 'smsProvider2',
                senderName: 'Dominion',
                token: ''
            }
        ]
    },

    session: {
        regularTtl: 3600 * 1000,
        persistentTtl: 3 * 31 * 24 * 3600 * 1000

    },

    mailGate: {
        active: 0,
        providers: [
            {
                name: 'SMTP',
                user: 'test@gmail.com',
                password: ''
            },
            {
                name: 'localost',
                user: '',
                password: ''
            }
        ]

    }
};