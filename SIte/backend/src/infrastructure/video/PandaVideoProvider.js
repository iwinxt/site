const axios = require('axios');
const crypto = require('crypto');

class PandaVideoProvider {
    constructor() {
        this.apiKey = process.env.PANDA_API_KEY;
        this.apiUrl = process.env.PANDA_API_URL;
    }

    async getSignedUrl(videoId, userId) {
        const expiresIn = 3600;
        const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
        
        const signature = crypto
            .createHmac('sha256', this.apiKey)
            .update(`${videoId}${userId}${timestamp}`)
            .digest('hex');

        const response = await axios.post(`${this.apiUrl}/videos/${videoId}/sign`, {
            user_id: userId,
            expires_at: timestamp,
            signature
        });

        return response.data.url;
    }
}

module.exports = { PandaVideoProvider };