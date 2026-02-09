import { auth } from './services/auth.js';
import { Dashboard } from './components/student/Dashboard.js';
import { LoginForm } from './components/auth/LoginForm.js';
import { RegisterForm } from './components/auth/RegisterForm.js';
import { CoursePage } from './pages/CoursePage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { PaymentStatus } from './components/checkout/PaymentStatus.js';

export class Router {
    constructor() {
        this.routes = {
            '/': Dashboard,
            '/login': LoginForm,
            '/register': RegisterForm
        };
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
        this.handleRoute();
    }

    navigateTo(url) {
        history.pushState(null, null, url);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const publicRoutes = ['/login', '/register'];
        const isAuthenticated = auth.isAuthenticated();

        if (!isAuthenticated && !publicRoutes.includes(path) && !path.startsWith('/public')) {
            this.navigateTo('/login');
            return;
        }

        if (isAuthenticated && publicRoutes.includes(path)) {
            this.navigateTo('/');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = '';

        // Dynamic routing
        if (path === '/') {
            new Dashboard(app);
        } else if (path === '/login') {
            new LoginForm(app);
        } else if (path === '/register') {
            new RegisterForm(app);
        } else if (path.startsWith('/course/')) {
            const courseId = path.split('/')[2];
            new CoursePage(app, courseId, null);
        } else if (path.startsWith('/lesson/')) {
            const lessonId = path.split('/')[2];
            // Fetch courseId from lesson
            new CoursePage(app, null, lessonId);
        } else if (path.startsWith('/checkout/')) {
            const courseId = path.split('/')[2];
            new CheckoutPage(app, courseId);
        } else if (path.startsWith('/payment/success')) {
            const params = new URLSearchParams(window.location.search);
            const paymentId = params.get('id');
            new PaymentStatus(app, paymentId);
        } else {
            app.innerHTML = '<h1>404 - Página não encontrada</h1>';
        }
    }
}