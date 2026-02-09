const { supabase } = require('../infrastructure/database/supabase');

class ProgressRepository {
    async findByUserAndLesson(userId, lessonId) {
        const { data, error } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();

        if (error) return null;
        return data;
    }

    async findByCourse(userId, courseId) {
        const { data, error } = await supabase
            .from('progress')
            .select(`
                *,
                lesson:lessons!inner(
                    *,
                    module:modules!inner(
                        course_id
                    )
                )
            `)
            .eq('user_id', userId)
            .eq('lesson.module.course_id', courseId);

        if (error) throw error;
        return data;
    }

    async create(data) {
        const { data: progress, error } = await supabase
            .from('progress')
            .insert({
                user_id: data.userId,
                lesson_id: data.lessonId,
                watched_percentage: data.watchedPercentage,
                last_position: data.lastPosition
            })
            .select()
            .single();

        if (error) throw error;
        return progress;
    }

    async update(id, data) {
        const { data: progress, error } = await supabase
            .from('progress')
            .update({
                watched_percentage: data.watchedPercentage,
                last_position: data.lastPosition
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return progress;
    }
}

module.exports = { ProgressRepository };