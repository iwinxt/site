const { supabase } = require('../infrastructure/database/supabase');

class CourseRepository {
    async findAll() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) return null;
        return data;
    }

    async getModules(courseId) {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('course_id', courseId)
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data;
    }

    async getLessons(moduleId) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', moduleId)
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data;
    }

    async findAllTrails() {
        const { data, error } = await supabase
            .from('trails')
            .select(`
                *,
                courses:courses(*)
            `)
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data;
    }
}

module.exports = { CourseRepository };