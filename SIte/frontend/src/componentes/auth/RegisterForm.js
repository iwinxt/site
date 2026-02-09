import { auth } from '../../services/auth.js';

export class RegisterForm {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Registro</h1>
                    <form id="registerForm">
                        <input type="text" id="name" placeholder="Nome" required>
                        <input type="email" id="email" placeholder="Email" required>
                        <input type="password" id="password" placeholder="Senha" required>
                        <button type="submit">Registrar</button>
                        <p class="error" id="error"></p>
                    </form>
                    <p>Já tem conta? <a href="/login" data-link>Faça login</a></p>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('error');

            try {
                await auth.register(email, password, name);
                window.location.href = '/';
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
    }
}