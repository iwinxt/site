const { CourseRepository } = require('../repositories/CourseRepository');
const { EnrollmentRepository } = require('../repositories/EnrollmentRepository');

class CourseService {
    constructor() {
        this.courseRepository = new CourseRepository();
        this.enrollmentRepository = new EnrollmentRepository();
    }

    async listCourses() {
        return await this.courseRepository.findAll();
    }

    async getCourseById(courseId, userId) {
        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw { status: 404, message: 'Curso não encontrado' };
        }

        const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
        const hasAccess = enrollment && enrollment.status === 'active';

        const modules = await this.courseRepository.getModules(courseId);

        for (let module of modules) {
            const lessons = await this.courseRepository.getLessons(module.id);
            module.lessons = hasAccess ? lessons : lessons.map(l => ({
                ...l,
                video_id: l.is_free ? l.video_id : null,
                locked: !l.is_free
            }));
        }

        return { ...course, modules, hasAccess };
    }

    async getTrails() {
        return await this.courseRepository.findAllTrails();
    }
}

module.exports = { CourseService };