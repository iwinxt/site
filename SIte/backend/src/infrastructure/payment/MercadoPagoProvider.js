const mercadopago = require('mercadopago');

class MercadoPagoProvider {
    constructor() {
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });
    }

    async createPayment(data) {
        const preference = {
            items: [{
                title: data.title || 'Curso',
                unit_price: data.amount,
                quantity: 1,
                currency_id: data.currency || 'BRL'
            }],
            back_urls: {
                success: `${process.env.FRONTEND_URL}/payment/success`,
                failure: `${process.env.FRONTEND_URL}/payment/failure`,
                pending: `${process.env.FRONTEND_URL}/payment/pending`
            },
            auto_return: 'approved',
            metadata: data.metadata
        };

        const response = await mercadopago.preferences.create(preference);

        return {
            id: response.body.id,
            initPoint: response.body.init_point
        };
    }

    async verifyWebhook(data) {
        if (data.type === 'payment') {
            const payment = await mercadopago.payment.get(data.data.id);
            return payment.body;
        }
        return null;
    }
}

module.exports = { MercadoPagoProvider };