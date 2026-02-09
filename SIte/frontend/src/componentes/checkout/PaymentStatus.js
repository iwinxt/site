import { paymentService } from '../../services/payment.js';

export class PaymentStatus {
    constructor(container, paymentId) {
        this.container = container;
        this.paymentId = paymentId;
        this.init();
    }

    async init() {
        this.container.innerHTML = '<div class="loader">Verificando pagamento...</div>';

        try {
            const { status } = await paymentService.getPaymentStatus(this.paymentId);
            this.render(status);
        } catch (error) {
            this.renderError();
        }
    }

    render(status) {
        const isSuccess = status === 'completed';
        
        this.container.innerHTML = `
            <div class="payment-status ${isSuccess ? 'success' : 'pending'}">
                <div class="payment-status__icon">
                    ${isSuccess ? '✓' : '⏳'}
                </div>
                <h1>${isSuccess ? 'Pagamento Confirmado!' : 'Pagamento Pendente'}</h1>
                <p>${isSuccess 
                    ? 'Seu curso já está disponível na sua dashboard.' 
                    : 'Aguardando confirmação do pagamento...'
                }</p>
                <a href="/" class="button" data-link>
                    ${isSuccess ? 'Ir para Dashboard' : 'Voltar'}
                </a>
            </div>
        `;
    }

    renderError() {
        this.container.innerHTML = `
            <div class="payment-status error">
                <div class="payment-status__icon">✗</div>
                <h1>Erro no Pagamento</h1>
                <p>Não foi possível processar seu pagamento. Tente novamente.</p>
                <a href="/" class="button" data-link>Voltar</a>
            </div>
        `;
    }
}