module.exports = {
    server: {
        host: "localhost",
        port: 3000,
        apiUrl: "https://localhost",
        clientUrl: "https://localhost"
    },

    router: {
        // e.g. api/v2/
        urlPrefix: "",
        // e.g. "[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}"
        primaryKeyPattern: "\\d+"
    },

    database: "mysql://root:root@localhost/dominion",

    cors: {
        // e.g. * | ["example.com"] | () => {} (synchronous callback function with Message context returning array of allowed origins)
        origin: "*",
        methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
        headers: ["Content-Type", "Set-Cookies", "Authorization"],
        credentials: false,
        maxAge: 5 /* seconds */
    },

    session: {
        regularTtl: 14 * 24 * 3600 * 1000 /* milliseconds*/,
        signTtl: 24 * 3600 * 1000 /* milliseconds*/
    },

    websockets: {
        clientTracking: true,
        perMessageDeflate: false,
        maxPayload: 400 * 1024 * 1024 /* bytes*/
    },

    media: {
        urlPath: "/media",
        saveDir: "../../media",
        supportsTypes: [
            "image/jpeg",
            "image/png",
            "image/gif"
        ]
    },

    smsGate: {
        active: 1,
        providers: [
            {
                name: "smsProvider1",
                senderName: "Dominion",
                token: ""
            },
            {
                name: "smsProvider2",
                senderName: "Dominion",
                token: ""
            }
        ]
    },

    emailGate: {
        active: 0,
        providers: [
            {
                type: "smtp",
                user: "test@gmail.com",
                password: ""
            },
            {
                type: "gmail",
                name: "localhost",
                user: "",
                password: ""
            }
        ],
        senders: {
            content: {
                from: "Dominion Framework <noreply@dominion.co.ua>",
                replyTo: "noreply@dominion.co.ua",
            }
        }
    }
};
