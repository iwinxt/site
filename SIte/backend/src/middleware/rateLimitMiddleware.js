const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
});

const strictRateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { rateLimitMiddleware, strictRateLimitMiddleware };