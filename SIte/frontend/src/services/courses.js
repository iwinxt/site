import { api } from './api.js';

class CourseService {
    async getCourses() {
        return await api.get('/courses');
    }

    async getCourse(id) {
        return await api.get(`/courses/${id}`);
    }

    async getTrails() {
        return await api.get('/courses/trails');
    }

    async getEnrollments() {
        return await api.get('/enrollments');
    }
}

export const courseService = new CourseService();