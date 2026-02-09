const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendWelcomeEmail(user) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Bem-vindo à nossa plataforma!',
            html: `
                <h1>Olá ${user.name}!</h1>
                <p>Seja bem-vindo à nossa plataforma de cursos online.</p>
                <p>Estamos muito felizes em tê-lo conosco!</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Redefinição de Senha',
            html: `
                <h1>Redefinição de Senha</h1>
                <p>Olá ${user.name},</p>
                <p>Recebemos uma solicitação para redefinir sua senha.</p>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Este link expira em 1 hora.</p>
                <p>Se você não solicitou esta redefinição, ignore este email.</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendEnrollmentConfirmation(user, course) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Matrícula Confirmada - ${course.name}`,
            html: `
                <h1>Matrícula Confirmada!</h1>
                <p>Olá ${user.name},</p>
                <p>Sua matrícula no curso <strong>${course.name}</strong> foi confirmada com sucesso!</p>
                <p>Acesse a plataforma e comece a aprender agora mesmo.</p>
                <a href="${process.env.FRONTEND_URL}/course/${course.id}">Acessar Curso</a>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendCourseCompletionEmail(user, course) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Parabéns! Você concluiu ${course.name}`,
            html: `
                <h1>Parabéns, ${user.name}!</h1>
                <p>Você concluiu o curso <strong>${course.name}</strong>!</p>
                <p>Seu certificado está disponível na plataforma.</p>
                <a href="${process.env.FRONTEND_URL}/certificate/${course.id}">Baixar Certificado</a>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendPaymentReceipt(user, payment) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Recibo de Pagamento',
            html: `
                <h1>Recibo de Pagamento</h1>
                <p>Olá ${user.name},</p>
                <p>Seu pagamento foi processado com sucesso.</p>
                <ul>
                    <li><strong>Valor:</strong> R$ ${payment.amount}</li>
                    <li><strong>Data:</strong> ${new Date(payment.created_at).toLocaleDateString()}</li>
                    <li><strong>ID da Transação:</strong> ${payment.id}</li>
                </ul>
                <p>Obrigado pela sua compra!</p>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }
}

module.exports = { EmailService };