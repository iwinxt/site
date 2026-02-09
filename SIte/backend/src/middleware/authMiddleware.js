const { verifyAccessToken } = require('../utils/jwt');
const { SessionService } = require('../services/SessionService');

const sessionService = new SessionService();

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        const isValid = await sessionService.validateSession(decoded.userId, token);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Sessão inválida' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Erro na autenticação' });
    }
}

module.exports = { authMiddleware };