import { courseService } from '../services/courses.js';
import { progressService } from '../services/progress.js';
import { Sidebar } from '../components/common/Sidebar.js';
import { VideoPlayer } from '../components/student/VideoPlayer.js';
import { QuizComponent } from '../components/student/QuizComponent.js';
import { Loader } from '../components/common/Loader.js';

export class CoursePage {
    constructor(container, courseId, lessonId) {
        this.container = container;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.course = null;
        this.currentLesson = null;
        this.init();
    }

    async init() {
        Loader.show(this.container, 'Carregando curso...');

        try {
            this.course = await courseService.getCourse(this.courseId);
            this.currentLesson = this.findLesson(this.lessonId);
            
            if (!this.currentLesson) {
                throw new Error('Aula não encontrada');
            }

            this.render();
        } catch (error) {
            this.container.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    findLesson(lessonId) {
        for (const module of this.course.modules) {
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    }

    render() {
        this.container.innerHTML = '';
        
        const layout = document.createElement('div');
        layout.className = 'course-layout';

        new Sidebar(layout, this.course.modules, this.lessonId);

        const main = document.createElement('main');
        main.className = 'course-main';

        const videoContainer = document.createElement('div');
        new VideoPlayer(videoContainer, this.currentLesson);
        main.appendChild(videoContainer);

        if (this.currentLesson.materials && this.currentLesson.materials.length > 0) {
            const materialsSection = this.renderMaterials();
            main.appendChild(materialsSection);
        }

        if (this.currentLesson.quizzes && this.currentLesson.quizzes.length > 0) {
            const quizContainer = document.createElement('div');
            this.currentLesson.quizzes.forEach(quiz => {
                new QuizComponent(quizContainer, quiz);
            });
            main.appendChild(quizContainer);
        }

        layout.appendChild(main);
        this.container.appendChild(layout);
    }

    renderMaterials() {
        const section = document.createElement('section');
        section.className = 'materials-section';
        section.innerHTML = `
            <h3>Materiais Complementares</h3>
            <div class="materials-list">
                ${this.currentLesson.materials.map(material => `
                    <a href="${material.file_url}" class="material-item" download>
                        <span class="material-icon">📄</span>
                        <span class="material-name">${material.name}</span>
                        <span class="material-size">${this.formatFileSize(material.file_size)}</span>
                    </a>
                `).join('')}
            </div>
        `;
        return section;
    }

    formatFileSize(bytes) {
        if (!bytes) return '';
        const mb = bytes / (1024 * 1024);
        return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
    }
}