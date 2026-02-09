const { ProgressService } = require('../services/ProgressService');

class ProgressController {
    constructor() {
        this.progressService = new ProgressService();
    }

    async updateProgress(req, res, next) {
        try {
            const userId = req.userId;
            const { lessonId, watchedPercentage, lastPosition } = req.body;
            
            const progress = await this.progressService.updateProgress(
                userId,
                lessonId,
                watchedPercentage,
                lastPosition
            );
            
            res.json(progress);
        } catch (error) {
            next(error);
        }
    }

    async getProgress(req, res, next) {
        try {
            const userId = req.userId;
            const { courseId } = req.params;
            const progress = await this.progressService.getCourseProgress(userId, courseId);
            res.json(progress);
        } catch (error) {
            next(error);
        }
    }

    async getLessonProgress(req, res, next) {
        try {
            const userId = req.userId;
            const { lessonId } = req.params;
            const progress = await this.progressService.getLessonProgress(userId, lessonId);
            res.json(progress);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { ProgressController };