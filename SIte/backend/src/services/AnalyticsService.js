const { supabase } = require('../infrastructure/database/supabase');

class AnalyticsService {
    async getCourseStats(courseId) {
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('course_id', courseId)
            .eq('status', 'active');

        if (enrollError) throw enrollError;

        const { data: completions, error: compError } = await supabase
            .from('progress')
            .select('user_id')
            .eq('is_completed', true)
            .in('lesson_id', 
                supabase
                    .from('lessons')
                    .select('id')
                    .in('module_id',
                        supabase
                            .from('modules')
                            .select('id')
                            .eq('course_id', courseId)
                    )
            );

        if (compError) throw compError;

        const { data: revenue, error: revError } = await supabase
            .from('payments')
            .select('amount')
            .eq('course_id', courseId)
            .eq('status', 'completed');

        if (revError) throw revError;

        const totalRevenue = revenue.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        return {
            totalEnrollments: enrollments.length,
            totalCompletions: new Set(completions.map(c => c.user_id)).size,
            totalRevenue,
            completionRate: enrollments.length > 0 
                ? (new Set(completions.map(c => c.user_id)).size / enrollments.length) * 100 
                : 0
        };
    }

    async getUserStats(userId) {
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select(`
                id,
                course:courses(name)
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (enrollError) throw enrollError;

        const { data: progress, error: progError } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId);

        if (progError) throw progError;

        const completedLessons = progress.filter(p => p.is_completed).length;
        const totalWatchTime = progress.reduce((sum, p) => sum + (p.last_position || 0), 0);

        return {
            totalCourses: enrollments.length,
            completedLessons,
            totalWatchTime: Math.round(totalWatchTime / 60), // minutes
            courses: enrollments.map(e => e.course.name)
        };
    }

    async getRevenueStats(startDate, endDate) {
        let query = supabase
            .from('payments')
            .select('amount, created_at, payment_method')
            .eq('status', 'completed');

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const { data, error } = await query;

        if (error) throw error;

        const total = data.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const byMethod = data.reduce((acc, p) => {
            acc[p.payment_method] = (acc[p.payment_method] || 0) + parseFloat(p.amount);
            return acc;
        }, {});

        return {
            totalRevenue: total,
            totalTransactions: data.length,
            averageTransaction: data.length > 0 ? total / data.length : 0,
            byPaymentMethod: byMethod
        };
    }
}

module.exports = { AnalyticsService };