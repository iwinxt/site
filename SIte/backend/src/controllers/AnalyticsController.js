const { AnalyticsService } = require('../services/AnalyticsService');

class AnalyticsController {
    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    async getCourseStats(req, res, next) {
        try {
            const { courseId } = req.params;
            const stats = await this.analyticsService.getCourseStats(courseId);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getUserStats(req, res, next) {
        try {
            const userId = req.userId;
            const stats = await this.analyticsService.getUserStats(userId);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getRevenueStats(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await this.analyticsService.getRevenueStats(startDate, endDate);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { AnalyticsController };