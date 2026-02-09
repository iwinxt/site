const { SessionService } = require('../services/SessionService');

const sessionService = new SessionService();

async function sessionMiddleware(req, res, next) {
    try {
        const userId = req.userId;
        const token = req.headers.authorization.substring(7);

        const hasDuplicateSession = await sessionService.checkDuplicateSession(userId, token);

        if (hasDuplicateSession) {
            await sessionService.invalidateOtherSessions(userId, token);
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { sessionMiddleware };