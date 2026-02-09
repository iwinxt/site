export class CourseCard {
    constructor(course) {
        this.course = course;
        this.element = this.create();
    }

    create() {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${this.course.thumbnail_url}" alt="${this.course.name}">
            <div class="course-card__content">
                <h3>${this.course.name}</h3>
                <p>${this.course.description}</p>
                <div class="progress-bar">
                    <div class="progress-bar__fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `/course/${this.course.id}`;
        });

        return card;
    }
}