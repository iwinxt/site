import { paymentService } from '../../services/payment.js';

export class CheckoutForm {
    constructor(container, course) {
        this.container = container;
        this.course = course;
        this.stripe = window.Stripe(process.env.STRIPE_PUBLIC_KEY);
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="checkout">
                <div class="checkout__summary">
                    <img src="${this.course.thumbnail_url}" alt="${this.course.name}">
                    <h2>${this.course.name}</h2>
                    <p>${this.course.description}</p>
                </div>
                
                <div class="checkout__form">
                    <h3>Escolha seu plano</h3>
                    <div class="checkout__plans">
                        ${this.course.price_once ? `
                            <label class="plan-option">
                                <input type="radio" name="plan" value="once" data-price="${this.course.price_once}">
                                <div class="plan-option__content">
                                    <span class="plan-option__name">Pagamento Único</span>
                                    <span class="plan-option__price">R$ ${this.course.price_once}</span>
                                </div>
                            </label>
                        ` : ''}
                        
                        ${this.course.price_monthly ? `
                            <label class="plan-option">
                                <input type="radio" name="plan" value="monthly" data-price="${this.course.price_monthly}">
                                <div class="plan-option__content">
                                    <span class="plan-option__name">Mensal</span>
                                    <span class="plan-option__price">R$ ${this.course.price_monthly}/mês</span>
                                </div>
                            </label>
                        ` : ''}
                        
                        ${this.course.price_yearly ? `
                            <label class="plan-option">
                                <input type="radio" name="plan" value="yearly" data-price="${this.course.price_yearly}">
                                <div class="plan-option__content">
                                    <span class="plan-option__name">Anual</span>
                                    <span class="plan-option__price">R$ ${this.course.price_yearly}/ano</span>
                                </div>
                            </label>
                        ` : ''}
                    </div>

                    <div id="card-element" class="checkout__card"></div>
                    <div id="card-errors" class="checkout__errors"></div>
                    
                    <button id="submitPayment" class="checkout__submit" disabled>
                        Finalizar Compra
                    </button>
                </div>
            </div>
        `;

        this.setupStripe();
        this.attachEvents();
    }

    setupStripe() {
        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    color: '#ffffff',
                    fontSize: '16px',
                    '::placeholder': { color: '#64748b' }
                }
            }
        });
        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event) => {
            const errorEl = document.getElementById('card-errors');
            errorEl.textContent = event.error ? event.error.message : '';
        });
    }

    attachEvents() {
        const planOptions = this.container.querySelectorAll('input[name="plan"]');
        const submitBtn = document.getElementById('submitPayment');

        planOptions.forEach(option => {
            option.addEventListener('change', () => {
                submitBtn.disabled = false;
            });
        });

        submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    async handleSubmit() {
        const selectedPlan = this.container.querySelector('input[name="plan"]:checked');
        
        if (!selectedPlan) {
            alert('Selecione um plano');
            return;
        }

        const submitBtn = document.getElementById('submitPayment');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';

        try {
            const { clientSecret, paymentId } = await paymentService.createPayment(
                this.course.id,
                'card',
                selectedPlan.value
            );

            const { error } = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.cardElement
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            window.location.href = `/payment/success?id=${paymentId}`;
        } catch (error) {
            document.getElementById('card-errors').textContent = error.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalizar Compra';
        }
    }
}