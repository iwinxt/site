export class Sidebar {
    constructor(container, modules, currentLessonId) {
        this.container = container;
        this.modules = modules;
        this.currentLessonId = currentLessonId;
        this.render();
    }

    render() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        
        sidebar.innerHTML = `
            <div class="sidebar__header">
                <h3>Conteúdo do Curso</h3>
            </div>
            <div class="sidebar__content">
                ${this.modules.map(module => this.renderModule(module)).join('')}
            </div>
        `;

        this.container.appendChild(sidebar);
    }

    renderModule(module) {
        return `
            <div class="sidebar__module">
                <h4>${module.name}</h4>
                <ul class="sidebar__lessons">
                    ${module.lessons.map(lesson => this.renderLesson(lesson)).join('')}
                </ul>
            </div>
        `;
    }

    renderLesson(lesson) {
        const isCurrent = lesson.id === this.currentLessonId;
        const isLocked = lesson.locked;
        
        return `
            <li class="sidebar__lesson ${isCurrent ? 'active' : ''} ${isLocked ? 'locked' : ''}">
                <a href="/lesson/${lesson.id}" data-link>
                    ${isLocked ? '🔒' : ''}
                    ${lesson.name}
                    ${lesson.is_completed ? '✓' : ''}
                </a>
            </li>
        `;
    }
}