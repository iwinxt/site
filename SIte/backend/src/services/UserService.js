const bcrypt = require('bcryptjs');
const { UserRepository } = require('../repositories/UserRepository');
const { logger } = require('../utils/logger');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw { status: 404, message: 'Usuário não encontrado' };
        }

        const { password_hash, ...userProfile } = user;
        return userProfile;
    }

    async updateProfile(userId, data) {
        const updateData = {};
        
        if (data.name) updateData.name = data.name;
        if (data.avatar_url) updateData.avatar_url = data.avatar_url;

        const user = await this.userRepository.update(userId, updateData);
        
        logger.info('Profile updated', { userId });
        
        const { password_hash, ...userProfile } = user;
        return userProfile;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw { status: 404, message: 'Usuário não encontrado' };
        }

        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            throw { status: 401, message: 'Senha atual incorreta' };
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(userId, { password_hash: newPasswordHash });

        logger.info('Password changed', { userId });
    }

    async deleteAccount(userId, password) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw { status: 404, message: 'Usuário não encontrado' };
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw { status: 401, message: 'Senha incorreta' };
        }

        await this.userRepository.delete(userId);

        logger.info('Account deleted', { userId });
    }
}

module.exports = { UserService };