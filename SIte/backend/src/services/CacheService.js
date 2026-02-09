const { RedisCache } = require('../infrastructure/cache/RedisCache');

class CacheService {
    constructor() {
        this.cache = new RedisCache();
    }

    getCourseKey(courseId) {
        return `course:${courseId}`;
    }

    getUserCoursesKey(userId) {
        return `user:${userId}:courses`;
    }

    getProgressKey(userId, courseId) {
        return `progress:${userId}:${courseId}`;
    }

    async getCourse(courseId) {
        return await this.cache.get(this.getCourseKey(courseId));
    }

    async setCourse(courseId, data, ttl = 3600) {
        return await this.cache.set(this.getCourseKey(courseId), data, ttl);
    }

    async invalidateCourse(courseId) {
        return await this.cache.delete(this.getCourseKey(courseId));
    }

    async getUserCourses(userId) {
        return await this.cache.get(this.getUserCoursesKey(userId));
    }

    async setUserCourses(userId, data, ttl = 1800) {
        return await this.cache.set(this.getUserCoursesKey(userId), data, ttl);
    }

    async invalidateUserCourses(userId) {
        return await this.cache.delete(this.getUserCoursesKey(userId));
    }

    async getProgress(userId, courseId) {
        return await this.cache.get(this.getProgressKey(userId, courseId));
    }

    async setProgress(userId, courseId, data, ttl = 300) {
        return await this.cache.set(this.getProgressKey(userId, courseId), data, ttl);
    }

    async invalidateProgress(userId, courseId) {
        return await this.cache.delete(this.getProgressKey(userId, courseId));
    }
}

module.exports = { CacheService };