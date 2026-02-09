const { AuditService } = require('../services/AuditService');

const auditService = new AuditService();

function auditMiddleware(action, entityType) {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function(data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const entityId = req.params.id || req.body.id;
                
                auditService.logUserAction(
                    req.userId,
                    action,
                    entityType,
                    entityId,
                    req
                ).catch(err => console.error('Audit error:', err));
            }

            originalSend.call(this, data);
        };

        next();
    };
}

module.exports = { auditMiddleware };