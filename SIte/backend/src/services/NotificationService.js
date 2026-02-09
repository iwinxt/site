const { EmailService } = require('./EmailService');
const { supabase } = require('../infrastructure/database/supabase');

class NotificationService {
    constructor() {
        this.emailService = new EmailService();
    }

    async notifyEnrollment(userId, courseId) {
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const { data: course } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (user && course) {
            await this.emailService.sendEnrollmentConfirmation(user, course);
        }
    }

    async notifyPaymentSuccess(userId, paymentId) {
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .single();

        if (user && payment) {
            await this.emailService.sendPaymentReceipt(user, payment);
        }
    }

    async notifyCourseCompletion(userId, courseId) {
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const { data: course } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (user && course) {
            await this.emailService.sendCourseCompletionEmail(user, course);
        }
    }

    async checkCourseCompletion(userId, courseId) {
        const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', courseId);

        if (!modules || modules.length === 0) return false;

        const moduleIds = modules.map(m => m.id);

        const { data: lessons } = await supabase
            .from('lessons')
            .select('id')
            .in('module_id', moduleIds);

        if (!lessons || lessons.length === 0) return false;

        const lessonIds = lessons.map(l => l.id);

        const { data: progress } = await supabase
            .from('progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('is_completed', true)
            .in('lesson_id', lessonIds);

        const isCompleted = progress && progress.length === lessons.length;

        if (isCompleted) {
            await this.notifyCourseCompletion(userId, courseId);
        }

        return isCompleted;
    }
}

module.exports = { NotificationService };