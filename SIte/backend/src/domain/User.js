class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.role = data.role || 'student';
        this.isActive = data.is_active ?? true;
        this.createdAt = data.created_at;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isStudent() {
        return this.role === 'student';
    }

    canAccessCourse(enrollment) {
        if (!enrollment) return false;
        if (enrollment.status !== 'active') return false;
        
        if (enrollment.expires_at) {
            return new Date() < new Date(enrollment.expires_at);
        }
        
        return true;
    }
}

module.exports = { User };