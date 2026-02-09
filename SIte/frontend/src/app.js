import { Router } from './router.js';
import { auth } from './services/auth.js';

class App {
    constructor() {
        this.router = new Router();
        this.init();
    }

    async init() {
        await auth.checkAuth();
        this.router.init();
    }
}

new App();