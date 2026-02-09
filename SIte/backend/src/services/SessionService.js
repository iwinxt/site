const { supabase } = require('../infrastructure/database/supabase');
const { hashToken } = require('../utils/jwt');

class SessionService {
    async createSession(userId, token, deviceInfo) {
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const { error } = await supabase
            .from('sessions')
            .insert({
                user_id: userId,
                token_hash: tokenHash,
                device_info: deviceInfo,
                ip_address: deviceInfo.ip,
                expires_at: expiresAt.toISOString()
            });

        if (error) throw error;
    }

    async validateSession(userId, token) {
        const tokenHash = hashToken(token);

        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('token_hash', tokenHash)
            .eq('is_active', true)
            .gt('expires_at', new Date().toISOString())
            .single();

        return !error && data;
    }

    async deleteSession(userId, token) {
        const tokenHash = hashToken(token);

        await supabase
            .from('sessions')
            .delete()
            .eq('user_id', userId)
            .eq('token_hash', tokenHash);
    }

    async invalidateOtherSessions(userId, currentToken = null) {
        let query = supabase
            .from('sessions')
            .update({ is_active: false })
            .eq('user_id', userId);

        if (currentToken) {
            const tokenHash = hashToken(currentToken);
            query = query.neq('token_hash', tokenHash);
        }

        await query;
    }

    async checkDuplicateSession(userId, currentToken) {
        const tokenHash = hashToken(currentToken);

        const { data } = await supabase
            .from('sessions')
            .select('id')
            .eq('user_id', userId)
            .eq('is_active', true)
            .neq('token_hash', tokenHash);

        return data && data.length > 0;
    }
}

module.exports = { SessionService };