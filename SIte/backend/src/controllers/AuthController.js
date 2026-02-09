const { AuthService } = require('../services/AuthService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const result = await this.authService.register(email, password, name);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const deviceInfo = {
                userAgent: req.headers['user-agent'],
                ip: req.ip
            };
            const result = await this.authService.login(email, password, deviceInfo);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refreshToken(refreshToken);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const userId = req.userId;
            const token = req.headers.authorization.substring(7);
            await this.authService.logout(userId, token);
            res.json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { AuthController };