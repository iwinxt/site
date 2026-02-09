class Payment {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.courseId = data.course_id;
        this.amount = data.amount;
        this.currency = data.currency || 'BRL';
        this.paymentMethod = data.payment_method;
        this.paymentProvider = data.payment_provider;
        this.providerPaymentId = data.provider_payment_id;
        this.status = data.status || 'pending';
        this.metadata = data.metadata || {};
        this.createdAt = data.created_at;
    }

    isPending() {
        return this.status === 'pending';
    }

    isCompleted() {
        return this.status === 'completed';
    }

    isFailed() {
        return this.status === 'failed';
    }

    markAsCompleted() {
        this.status = 'completed';
    }

    markAsFailed() {
        this.status = 'failed';
    }
}

module.exports = { Payment };