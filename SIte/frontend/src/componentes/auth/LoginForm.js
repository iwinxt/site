import { auth } from '../../services/auth.js';

export class LoginForm {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Login</h1>
                    <form id="loginForm">
                        <input type="email" id="email" placeholder="Email" required>
                        <input type="password" id="password" placeholder="Senha" required>
                        <button type="submit">Entrar</button>
                        <p class="error" id="error"></p>
                    </form>
                    <p>Não tem conta? <a href="/register" data-link>Registre-se</a></p>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('error');

            try {
                await auth.login(email, password);
                window.location.href = '/';
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
    }
}