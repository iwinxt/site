class Enrollment {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.courseId = data.course_id;
        this.enrollmentType = data.enrollment_type;
        this.status = data.status;
        this.expiresAt = data.expires_at;
        this.createdAt = data.created_at;
    }

    isActive() {
        if (this.status !== 'active') return false;
        
        if (this.expiresAt) {
            return new Date() < new Date(this.expiresAt);
        }
        
        return true;
    }

    isExpired() {
        if (!this.expiresAt) return false;
        return new Date() >= new Date(this.expiresAt);
    }

    daysUntilExpiration() {
        if (!this.expiresAt) return null;
        
        const now = new Date();
        const expiry = new Date(this.expiresAt);
        const diff = expiry - now;
        
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}

module.exports = { Enrollment };