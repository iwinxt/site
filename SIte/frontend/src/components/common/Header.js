import { auth } from '../../services/auth.js';

export class Header {
    constructor(container) {
        const header = document.createElement('header');
        header.className = 'header';
        header.innerHTML = `
            <div class="header__container">
                <h1>LMS Platform</h1>
                <nav>
                    <a href="/" data-link>Dashboard</a>
                    <button id="logoutBtn">Sair</button>
                </nav>
            </div>
        `;

        container.appendChild(header);

        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.logout();
        });
    }
}