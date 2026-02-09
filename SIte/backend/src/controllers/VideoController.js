const { VideoService } = require('../services/VideoService');

class VideoController {
    constructor() {
        this.videoService = new VideoService();
    }

    async getVideoUrl(req, res, next) {
        try {
            const userId = req.userId;
            const { lessonId } = req.params;
            
            const url = await this.videoService.getSignedVideoUrl(userId, lessonId);
            res.json({ url });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { VideoController };