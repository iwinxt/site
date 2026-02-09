const { EnrollmentService } = require('../services/EnrollmentService');

class EnrollmentController {
    constructor() {
        this.enrollmentService = new EnrollmentService();
    }

    async getUserEnrollments(req, res, next) {
        try {
            const userId = req.userId;
            const enrollments = await this.enrollmentService.getUserEnrollments(userId);
            res.json(enrollments);
        } catch (error) {
            next(error);
        }
    }

    async checkAccess(req, res, next) {
        try {
            const userId = req.userId;
            const { courseId } = req.params;
            const hasAccess = await this.enrollmentService.checkAccess(userId, courseId);
            res.json({ hasAccess });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { EnrollmentController };