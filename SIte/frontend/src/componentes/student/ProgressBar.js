export class ProgressBar {
    constructor(percentage) {
        this.percentage = percentage;
    }

    create() {
        const container = document.createElement('div');
        container.className = 'progress-bar-component';
        container.innerHTML = `
            <div class="progress-bar-component__track">
                <div class="progress-bar-component__fill" style="width: ${this.percentage}%"></div>
            </div>
            <span class="progress-bar-component__label">${this.percentage}% concluído</span>
        `;
        return container;
    }
}