const { EnrollmentRepository } = require('../repositories/EnrollmentRepository');

class EnrollmentService {
    constructor() {
        this.enrollmentRepository = new EnrollmentRepository();
    }

    async getUserEnrollments(userId) {
        return await this.enrollmentRepository.findByUser(userId);
    }

    async checkAccess(userId, courseId) {
        const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
        
        if (!enrollment || enrollment.status !== 'active') {
            return false;
        }

        if (enrollment.expires_at) {
            const now = new Date();
            const expiresAt = new Date(enrollment.expires_at);
            if (now > expiresAt) {
                await this.enrollmentRepository.updateStatus(enrollment.id, 'expired');
                return false;
            }
        }

        return true;
    }

    async createEnrollment(userId, courseId, enrollmentType, expiresAt = null) {
        return await this.enrollmentRepository.create({
            userId,
            courseId,
            enrollmentType,
            expiresAt
        });
    }
}

module.exports = { EnrollmentService };