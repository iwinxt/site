const { supabase } = require('../infrastructure/database/supabase');

class PaymentRepository {
    async create(data) {
        const { data: payment, error } = await supabase
            .from('payments')
            .insert({
                user_id: data.userId,
                course_id: data.courseId,
                amount: data.amount,
                payment_method: data.paymentMethod,
                payment_provider: data.paymentProvider,
                metadata: data.metadata || {}
            })
            .select()
            .single();

        if (error) throw error;
        return payment;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }

    async findByProviderPaymentId(providerPaymentId) {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('provider_payment_id', providerPaymentId)
            .single();

        if (error) return null;
        return data;
    }

    async update(id, data) {
        const { error } = await supabase
            .from('payments')
            .update(data)
            .eq('id', id);

        if (error) throw error;
    }

    async updateStatus(id, status) {
        await this.update(id, { status });
    }
}

module.exports = { PaymentRepository };