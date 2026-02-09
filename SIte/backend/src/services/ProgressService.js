const { ProgressRepository } = require('../repositories/ProgressRepository');

class ProgressService {
    constructor() {
        this.progressRepository = new ProgressRepository();
    }

    async updateProgress(userId, lessonId, watchedPercentage, lastPosition) {
        const existing = await this.progressRepository.findByUserAndLesson(userId, lessonId);

        if (existing) {
            return await this.progressRepository.update(existing.id, {
                watchedPercentage,
                lastPosition
            });
        } else {
            return await this.progressRepository.create({
                userId,
                lessonId,
                watchedPercentage,
                lastPosition
            });
        }
    }

    async getCourseProgress(userId, courseId) {
        return await this.progressRepository.findByCourse(userId, courseId);
    }

    async getLessonProgress(userId, lessonId) {
        return await this.progressRepository.findByUserAndLesson(userId, lessonId);
    }
}

module.exports = { ProgressService };