import { courseService } from '../services/courses.js';
import { CheckoutForm } from '../components/checkout/CheckoutForm.js';
import { Loader } from '../components/common/Loader.js';

export class CheckoutPage {
    constructor(container, courseId) {
        this.container = container;
        this.courseId = courseId;
        this.init();
    }

    async init() {
        Loader.show(this.container, 'Carregando...');

        try {
            const course = await courseService.getCourse(this.courseId);
            this.render(course);
        } catch (error) {
            this.container.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    render(course) {
        this.container.innerHTML = '';
        new CheckoutForm(this.container, course);
    }
}