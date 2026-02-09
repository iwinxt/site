import { api } from './api.js';

class ProgressService {
    async updateProgress(lessonId, watchedPercentage, lastPosition) {
        return await api.post('/progress', {
            lessonId,
            watchedPercentage,
            lastPosition
        });
    }

    async getCourseProgress(courseId) {
        return await api.get(`/progress/course/${courseId}`);
    }

    async getLessonProgress(lessonId) {
        return await api.get(`/progress/lesson/${lessonId}`);
    }
}

export const progressService = new ProgressService();