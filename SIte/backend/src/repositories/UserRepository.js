const { supabase } = require('../infrastructure/database/supabase');

class UserRepository {
    async create(data) {
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                email: data.email,
                password_hash: data.passwordHash,
                name: data.name
            })
            .select()
            .single();

        if (error) throw error;
        return user;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }

    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) return null;
        return data;
    }

    async update(id, data) {
        const { data: user, error } = await supabase
            .from('users')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return user;
    }

    async delete(id) {
        const { error } = await supabase
            .from('users')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;
    }
}

module.exports = { UserRepository };