import { paymentService } from '../../services/payment.js';
import { progressService } from '../../services/progress.js';

export class VideoPlayer {
    constructor(container, lesson) {
        this.container = container;
        this.lesson = lesson;
        this.player = null;
        this.progressInterval = null;
        this.init();
    }

    async init() {
        try {
            const { url } = await paymentService.getVideoUrl(this.lesson.id);
            this.render(url);
            this.setupProgressTracking();
        } catch (error) {
            this.container.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }

    render(videoUrl) {
        this.container.innerHTML = `
            <div class="video-player">
                <video id="videoElement" controls controlsList="nodownload">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
                <div class="video-info">
                    <h2>${this.lesson.name}</h2>
                    <p>${this.lesson.description || ''}</p>
                </div>
            </div>
        `;

        this.player = document.getElementById('videoElement');
    }

    setupProgressTracking() {
        this.player.addEventListener('timeupdate', () => {
            const percentage = (this.player.currentTime / this.player.duration) * 100;
            
            if (!this.progressInterval) {
                this.progressInterval = setInterval(() => {
                    this.saveProgress(percentage, this.player.currentTime);
                }, 5000);
            }
        });

        this.player.addEventListener('pause', () => {
            const percentage = (this.player.currentTime / this.player.duration) * 100;
            this.saveProgress(percentage, this.player.currentTime);
        });

        this.player.addEventListener('ended', () => {
            this.saveProgress(100, this.player.duration);
            clearInterval(this.progressInterval);
        });
    }

    async saveProgress(percentage, position) {
        try {
            await progressService.updateProgress(
                this.lesson.id,
                Math.round(percentage),
                Math.round(position)
            );
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
        }
    }

    destroy() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
}