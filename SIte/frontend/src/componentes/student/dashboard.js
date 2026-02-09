import { courseService } from '../../services/courses.js';
import { CourseCard } from './CourseCard.js';
import { Header } from '../common/Header.js';

export class Dashboard {
    constructor(container) {
        this.container = container;
        this.init();
    }

    async init() {
        this.container.innerHTML = '<div class="loader">Carregando...</div>';
        
        try {
            const enrollments = await courseService.getEnrollments();
            this.render(enrollments);
        } catch (error) {
            this.container.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    render(enrollments) {
        this.container.innerHTML = '';
        
        new Header(this.container);

        const main = document.createElement('main');
        main.className = 'dashboard';
        
        const title = document.createElement('h1');
        title.textContent = 'Meus Cursos';
        main.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'course-grid';

        enrollments.forEach(enrollment => {
            const card = new CourseCard(enrollment.course);
            grid.appendChild(card.element);
        });

        main.appendChild(grid);
        this.container.appendChild(main);
    }
}   