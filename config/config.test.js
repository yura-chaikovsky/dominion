module.exports = {
    server: {
        host: 'localhost',
        port: 3001
    },

    router: {
        urlPrefix: ''
    },

    database: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        testDatabaseName: 'dominion_test',
        connectionLimit: 1,
    },
    
    media: {
        urlPath: '/mediaTest',
        saveDir: '../../mediaTest',
        supportsTypes: [
            'image/jpeg',
            'image/png',
            'image/gif'
        ]
    },

    corsAllowHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Set-Cookies'
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