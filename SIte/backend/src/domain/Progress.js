class Progress {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.lessonId = data.lesson_id;
        this.watchedPercentage = data.watched_percentage || 0;
        this.isCompleted = data.is_completed || false;
        this.lastPosition = data.last_position || 0;
        this.completedAt = data.completed_at;
    }

    shouldAutoComplete(newPercentage) {
        return !this.isCompleted && newPercentage >= 90;
    }

    updateProgress(percentage, position) {
        this.watchedPercentage = Math.max(this.watchedPercentage, percentage);
        this.lastPosition = position;
        
        if (this.shouldAutoComplete(percentage)) {
            this.isCompleted = true;
            this.completedAt = new Date();
        }
    }
}

module.exports = { Progress };