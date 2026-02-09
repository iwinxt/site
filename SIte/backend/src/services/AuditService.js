const { supabase } = require('../infrastructure/database/supabase');

class AuditService {
    async log(data) {
        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: data.userId,
                action: data.action,
                entity_type: data.entityType,
                entity_id: data.entityId,
                old_data: data.oldData,
                new_data: data.newData,
                ip_address: data.ipAddress,
                user_agent: data.userAgent
            });

        if (error) {
            console.error('Audit log error:', error);
        }
    }

    async logUserAction(userId, action, entityType, entityId, req) {
        await this.log({
            userId,
            action,
            entityType,
            entityId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }

    async logDataChange(userId, action, entityType, entityId, oldData, newData, req) {
        await this.log({
            userId,
            action,
            entityType,
            entityId,
            oldData,
            newData,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }

    async getAuditLogs(filters = {}) {
        let query = supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.userId) {
            query = query.eq('user_id', filters.userId);
        }

        if (filters.action) {
            query = query.eq('action', filters.action);
        }

        if (filters.entityType) {
            query = query.eq('entity_type', filters.entityType);
        }

        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        const { data, error } = await query.limit(filters.limit || 100);

        if (error) throw error;
        return data;
    }
}

module.exports = { AuditService };