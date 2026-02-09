const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeProvider {
    async createPayment(data) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(data.amount * 100),
            currency: data.currency.toLowerCase(),
            metadata: data.metadata
        });

        return {
            id: paymentIntent.id,
            clientSecret: paymentIntent.client_secret
        };
    }

    async verifyWebhook(payload, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
}

module.exports = { StripeProvider };