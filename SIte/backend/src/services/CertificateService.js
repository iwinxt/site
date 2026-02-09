const PDFDocument = require('pdfkit');
const { supabase } = require('../infrastructure/database/supabase');
const fs = require('fs');
const path = require('path');

class CertificateService {
    async generateCertificate(userId, courseId) {
        const { data: user } = await supabase
            .from('users')
            .select('name')
            .eq('id', userId)
            .single();

        const { data: course } = await supabase
            .from('courses')
            .select('name')
            .eq('id', courseId)
            .single();

        if (!user || !course) {
            throw new Error('Usuário ou curso não encontrado');
        }

        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4'
        });

        const fileName = `certificate_${userId}_${courseId}.pdf`;
        const filePath = path.join(__dirname, '../../temp', fileName);

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc
            .fontSize(40)
            .font('Helvetica-Bold')
            .text('CERTIFICADO', 0, 100, { align: 'center' });

        doc
            .moveDown()
            .fontSize(20)
            .font('Helvetica')
            .text('Certificamos que', { align: 'center' });

        doc
            .moveDown()
            .fontSize(30)
            .font('Helvetica-Bold')
            .text(user.name, { align: 'center' });

        doc
            .moveDown()
            .fontSize(20)
            .font('Helvetica')
            .text('concluiu com êxito o curso', { align: 'center' });

        doc
            .moveDown()
            .fontSize(25)
            .font('Helvetica-Bold')
            .text(course.name, { align: 'center' });

        doc
            .moveDown(2)
            .fontSize(14)
            .font('Helvetica')
            .text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        });
    }

    async getCertificate(userId, courseId) {
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('status', 'active')
            .single();

        if (!enrollment) {
            throw new Error('Matrícula não encontrada');
        }

        // Check if course is completed
        const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', courseId);

        const moduleIds = modules.map(m => m.id);

        const { data: lessons } = await supabase
            .from('lessons')
            .select('id')
            .in('module_id', moduleIds);

        const lessonIds = lessons.map(l => l.id);

        const { data: progress } = await supabase
            .from('progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('is_completed', true)
            .in('lesson_id', lessonIds);

        if (!progress || progress.length !== lessons.length) {
            throw new Error('Curso não concluído');
        }

        return await this.generateCertificate(userId, courseId);
    }
}

module.exports = { CertificateService };