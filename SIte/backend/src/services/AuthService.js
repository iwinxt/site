const bcrypt = require('bcryptjs');
const { UserRepository } = require('../repositories/UserRepository');
const { SessionService } = require('./SessionService');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
        this.sessionService = new SessionService();
    }

    async register(email, password, name) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw { status: 400, message: 'Email já cadastrado' };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({ email, passwordHash, name });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await this.sessionService.createSession(user.id, accessToken, {});

        return {
            user: { id: user.id, email: user.email, name: user.name },
            accessToken,
            refreshToken
        };
    }

    async login(email, password, deviceInfo) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw { status: 401, message: 'Credenciais inválidas' };
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw { status: 401, message: 'Credenciais inválidas' };
        }

        if (!user.is_active) {
            throw { status: 403, message: 'Usuário inativo' };
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await this.sessionService.invalidateOtherSessions(user.id);
        await this.sessionService.createSession(user.id, accessToken, deviceInfo);

        return {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            throw { status: 401, message: 'Refresh token inválido' };
        }

        const user = await this.userRepository.findById(decoded.userId);
        if (!user || !user.is_active) {
            throw { status: 401, message: 'Usuário não encontrado ou inativo' };
        }

        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    async logout(userId, token) {
        await this.sessionService.deleteSession(userId, token);
    }
}

module.exports = { AuthService };