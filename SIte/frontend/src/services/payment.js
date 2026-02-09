import { api } from './api.js';

class PaymentService {
    async createPayment(courseId, paymentMethod, enrollmentType) {
        return await api.post('/payments', {
            courseId,
            paymentMethod,
            enrollmentType
        });
    }

    async getPaymentStatus(paymentId) {
        return await api.get(`/payments/${paymentId}/status`);
    }

    async getVideoUrl(lessonId) {
        return await api.get(`/payments/video/${lessonId}`);
    }
}

export const paymentService = new PaymentService();