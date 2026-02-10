module.exports = {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    },
    
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100
    },
    
    strictRateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 5
    },
    
    session: {
        maxActiveSessions: 3,
        sessionTimeout: 15 * 60 * 1000
    },
    
    video: {
        signedUrlExpiry: 3600,
        providers: ['panda', 'bunny']
    },
    
};