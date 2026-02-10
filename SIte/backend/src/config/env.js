require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    
    PANDA_API_KEY: process.env.PANDA_API_KEY,
    PANDA_API_URL: process.env.PANDA_API_URL,
    
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};