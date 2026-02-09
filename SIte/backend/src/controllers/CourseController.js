const { CourseService } = require('../services/CourseService');

class CourseController {
    constructor() {
        this.courseService = new CourseService();
    }

    async list(req, res, next) {
        try {
            const courses = await this.courseService.listCourses();
            res.json(courses);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const course = await this.courseService.getCourseById(id, userId);
            res.json(course);
        } catch (error) {
            next(error);
        }
    }

    async getTrails(req, res, next) {
        try {
            const trails = await this.courseService.getTrails();
            res.json(trails);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { CourseController };