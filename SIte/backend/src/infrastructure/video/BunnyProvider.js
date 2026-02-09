const axios = require('axios');

class BunnyProvider {
    constructor() {
        this.apiKey = process.env.BUNNY_API_KEY;
        this.libraryId = process.env.BUNNY_LIBRARY_ID;
        this.apiUrl = 'https://video.bunnycdn.com';
    }

    async getSignedUrl(videoId, userId) {
        const expiresIn = 3600;
        const expires = Math.floor(Date.now() / 1000) + expiresIn;
        
        const token = this.generateToken(videoId, userId, expires);

        return `${this.apiUrl}/play/${this.libraryId}/${videoId}?token=${token}&expires=${expires}`;
    }

    generateToken(videoId, userId, expires) {
        const crypto = require('crypto');
        const data = `${this.libraryId}${videoId}${expires}${userId}`;
        
        return crypto
            .createHmac('sha256', this.apiKey)
            .update(data)
            .digest('hex');
    }

    async uploadVideo(file, title) {
        const response = await axios.post(
            `${this.apiUrl}/library/${this.libraryId}/videos`,
            { title },
            {
                headers: {
                    'AccessKey': this.apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.guid;
    }
}

module.exports = { BunnyProvider };