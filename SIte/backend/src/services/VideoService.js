const { EnrollmentService } = require('./EnrollmentService');
const { CourseRepository } = require('../repositories/CourseRepository');
const { PandaVideoProvider } = require('../infrastructure/video/PandaVideoProvider');

class VideoService {
    constructor() {
        this.enrollmentService = new EnrollmentService();
        this.courseRepository = new CourseRepository();
        this.videoProvider = new PandaVideoProvider();
    }

    async getSignedVideoUrl(userId, lessonId) {
        const lesson = await this.getLessonWithCourse(lessonId);
        
        if (!lesson) {
            throw { status: 404, message: 'Aula não encontrada' };
        }

        if (!lesson.is_free) {
            const hasAccess = await this.enrollmentService.checkAccess(userId, lesson.courseId);
            if (!hasAccess) {
                throw { status: 403, message: 'Acesso negado' };
            }
        }

        const signedUrl = await this.videoProvider.getSignedUrl(lesson.video_id, userId);
        return signedUrl;
    }

    async getLessonWithCourse(lessonId) {
        const { supabase } = require('../infrastructure/database/supabase');
        
        const { data, error } = await supabase
            .from('lessons')
            .select(`
                *,
                module:modules!inner(
                    course_id
                )
            `)
            .eq('id', lessonId)
            .single();

        if (error) return null;
        
        return {
            ...data,
            courseId: data.module.course_id
        };
    }
}

module.exports = { VideoService };