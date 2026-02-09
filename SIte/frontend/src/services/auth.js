import { api } from './api.js';
import { storage } from '../utils/storage.js';

class AuthService {
    async register(email, password, name) {
        const data = await api.post('/auth/register', { email, password, name });
        this.saveTokens(data);
        return data;
    }

    async login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        this.saveTokens(data);
        return data;
    }

    async logout() {
        await api.post('/auth/logout');
        storage.clear();
        window.location.href = '/login';
    }

    saveTokens(data) {
        storage.set('accessToken', data.accessToken);
        storage.set('refreshToken', data.refreshToken);
        storage.set('user', data.user);
    }

    isAuthenticated() {
        return !!storage.get('accessToken');
    }

    getUser() {
        return storage.get('user');
    }

    async checkAuth() {
        if (!this.isAuthenticated()) return false;
        return true;
    }
}

export const auth = new AuthService();