function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
    }
    
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Senha deve conter pelo menos um número' };
    }
    
    return { valid: true };
}

function validateCourse(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Nome do curso é obrigatório');
    }
    
    if (!data.trail_id) {
        errors.push('Trilha é obrigatória');
    }
    
    if (!data.price_once && !data.price_monthly && !data.price_yearly) {
        errors.push('Pelo menos um tipo de preço deve ser definido');
    }
    
    return { valid: errors.length === 0, errors };
}

function validateEnrollment(data) {
    const errors = [];
    
    if (!data.userId) {
        errors.push('ID do usuário é obrigatório');
    }
    
    if (!data.courseId) {
        errors.push('ID do curso é obrigatório');
    }
    
    if (!['once', 'monthly', 'yearly'].includes(data.enrollmentType)) {
        errors.push('Tipo de matrícula inválido');
    }
    
    return { valid: errors.length === 0, errors };
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/[<>]/g, '')
        .trim();
}

module.exports = {
    validateEmail,
    validatePassword,
    validateCourse,
    validateEnrollment,
    sanitizeInput
};