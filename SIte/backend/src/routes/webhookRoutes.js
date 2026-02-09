const express = require('express');
const { PaymentService } = require('../services/PaymentService');
const { StripeProvider } = require('../infrastructure/payment/StripeProvider');

const router = express.Router();
const paymentService = new PaymentService();
const stripeProvider = new StripeProvider();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
        const event = await stripeProvider.verifyWebhook(req.body, signature);

        if (event.type === 'payment_intent.succeeded') {
            await paymentService.handlePaymentSuccess(event.data.object.id);
        }

        res.json({ received: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;