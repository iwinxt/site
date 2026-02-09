const { supabase } = require('../infrastructure/database/supabase');

class EnrollmentRepository {
    async findByUser(userId) {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:courses(*)
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error) throw error;
        return data;
    }

    async findByUserAndCourse(userId, courseId) {
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (error) return null;
        return data;
    }

    async create(data) {
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert({
                user_id: data.userId,
                course_id: data.courseId,
                enrollment_type: data.enrollmentType,
                expires_at: data.expiresAt
            })
            .select()
            .single();

        if (error) throw error;
        return enrollment;
    }

    async updateStatus(id, status) {
        const { error } = await supabase
            .from('enrollments')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
}

module.exports = { EnrollmentRepository };