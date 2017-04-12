module.exports = {
    server: {
        host: 'localhost',
        port: 3001
    },

    router: {
        // e.g. api/v2/
        urlPrefix: ''
    },

    database: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        testDatabaseName: 'dominion_test',
        connectionLimit: 1,
    },

    cors: {
        // e.g. * | ['example.com'] | () => {} (callback function)
        origin: '*',
        methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
        headers: ['Content-Type', 'Set-Cookies', 'Access-Token'],
        credentials: false,
        maxAge: 5 /* seconds */
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
    
    emailGate: {
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