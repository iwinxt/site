const { PaymentRepository } = require('../repositories/PaymentRepository');
const { CourseRepository } = require('../repositories/CourseRepository');
const { EnrollmentService } = require('./EnrollmentService');
const { StripeProvider } = require('../infrastructure/payment/StripeProvider');

class PaymentService {
    constructor() {
        this.paymentRepository = new PaymentRepository();
        this.courseRepository = new CourseRepository();
        this.enrollmentService = new EnrollmentService();
        this.paymentProvider = new StripeProvider();
    }

    async createPayment(userId, courseId, paymentMethod, enrollmentType) {
        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw { status: 404, message: 'Curso não encontrado' };
        }

        let amount;
        if (enrollmentType === 'once') {
            amount = course.price_once;
        } else if (enrollmentType === 'monthly') {
            amount = course.price_monthly;
        } else if (enrollmentType === 'yearly') {
            amount = course.price_yearly;
        }

        if (!amount) {
            throw { status: 400, message: 'Tipo de matrícula não disponível' };
        }

        const payment = await this.paymentRepository.create({
            userId,
            courseId,
            amount,
            paymentMethod,
            paymentProvider: 'stripe'
        });

        const providerPayment = await this.paymentProvider.createPayment({
            amount,
            currency: 'BRL',
            metadata: { paymentId: payment.id, userId, courseId, enrollmentType }
        });

        await this.paymentRepository.update(payment.id, {
            providerPaymentId: providerPayment.id
        });

        return {
            paymentId: payment.id,
            clientSecret: providerPayment.clientSecret,
            amount
        };
    }

    async handlePaymentSuccess(providerPaymentId) {
        const payment = await this.paymentRepository.findByProviderPaymentId(providerPaymentId);
        if (!payment) return;

        await this.paymentRepository.updateStatus(payment.id, 'completed');

        const metadata = payment.metadata;
        let expiresAt = null;

        if (metadata.enrollmentType === 'monthly') {
            expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else if (metadata.enrollmentType === 'yearly') {
            expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        }

        await this.enrollmentService.createEnrollment(
            payment.user_id,
            payment.course_id,
            metadata.enrollmentType,
            expiresAt
        );
    }

    async getPaymentStatus(paymentId) {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw { status: 404, message: 'Pagamento não encontrado' };
        }
        return { status: payment.status };
    }
}

module.exports = { PaymentService };