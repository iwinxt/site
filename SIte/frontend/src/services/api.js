import { storage } from '../utils/storage.js';

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    async request(endpoint, options = {}) {
        const token = storage.get('accessToken');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                return this.request(endpoint, options);
            } else {
                storage.clear();
                window.location.href = '/login';
                return;
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }

        return data;
    }

    async refreshToken() {
        const refreshToken = storage.get('refreshToken');
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) return false;

            const data = await response.json();
            storage.set('accessToken', data.accessToken);
            storage.set('refreshToken', data.refreshToken);
            return true;
        } catch {
            return false;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiService();