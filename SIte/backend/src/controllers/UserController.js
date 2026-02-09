const { UserService } = require('../services/UserService');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.userId;
            const user = await this.userService.getUserProfile(userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.userId;
            const { name, avatar_url } = req.body;
            const user = await this.userService.updateProfile(userId, { name, avatar_url });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;
            await this.userService.changePassword(userId, currentPassword, newPassword);
            res.json({ message: 'Senha alterada com sucesso' });
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const userId = req.userId;
            const { password } = req.body;
            await this.userService.deleteAccount(userId, password);
            res.json({ message: 'Conta excluída com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { UserController };