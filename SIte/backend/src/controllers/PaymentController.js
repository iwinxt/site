const { PaymentService } = require('../services/PaymentService');

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    async createPayment(req, res, next) {
        try {
            const userId = req.userId;
            const { courseId, paymentMethod, enrollmentType } = req.body;
            
            const payment = await this.paymentService.createPayment(
                userId,
                courseId,
                paymentMethod,
                enrollmentType
            );
            
            res.json(payment);
        } catch (error) {
            next(error);
        }
    }

    async getPaymentStatus(req, res, next) {
        try {
            const { paymentId } = req.params;
            const status = await this.paymentService.getPaymentStatus(paymentId);
            res.json(status);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { PaymentController };