const { validateEmail, validatePassword, sanitizeInput } = require('../utils/validators');

function validateRegistration(req, res, next) {
    const { email, password, name } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
    }

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    req.body.email = sanitizeInput(email);
    req.body.name = sanitizeInput(name);

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    req.body.email = sanitizeInput(email);

    next();
}

function validateProgressUpdate(req, res, next) {
    const { lessonId, watchedPercentage, lastPosition } = req.body;

    if (!lessonId) {
        return res.status(400).json({ error: 'ID da aula é obrigatório' });
    }

    if (typeof watchedPercentage !== 'number' || watchedPercentage < 0 || watchedPercentage > 100) {
        return res.status(400).json({ error: 'Porcentagem assistida inválida' });
    }

    if (typeof lastPosition !== 'number' || lastPosition < 0) {
        return res.status(400).json({ error: 'Posição inválida' });
    }

    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
    validateProgressUpdate
};